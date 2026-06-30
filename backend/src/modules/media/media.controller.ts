import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '../../config/db.js';
import { s3Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '../../config/s3.js';

// --- FOLDER CONTROLLERS ---

export const getFolders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folders = await prisma.mediaFolder.findMany({
      include: {
        creator: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: folders
    });
  } catch (error) {
    next(error);
  }
};

export const createFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required.'
      });
    }

    let path = `/${name}`;
    if (parentId) {
      const parentFolder = await prisma.mediaFolder.findUnique({
        where: { id: parentId }
      });

      if (!parentFolder) {
        return res.status(400).json({
          success: false,
          message: 'Parent folder does not exist.'
        });
      }
      path = `${parentFolder.path}/${name}`;
    }

    const folder = await prisma.mediaFolder.create({
      data: {
        name,
        parentId: parentId === '' || parentId === null ? null : parentId,
        path,
        createdBy: req.user!.id
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Folder created successfully.',
      data: folder
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const folder = await prisma.mediaFolder.findUnique({
      where: { id }
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found.'
      });
    }

    // Check if empty
    const [subfolderCount, fileCount] = await Promise.all([
      prisma.mediaFolder.count({ where: { parentId: id } }),
      prisma.mediaFile.count({ where: { folderId: id } })
    ]);

    if (subfolderCount > 0 || fileCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete folder because it contains subfolders or files.'
      });
    }

    await prisma.mediaFolder.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Folder deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// --- FILE CONTROLLERS ---

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const { folderId, altText, caption, description } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.'
      });
    }

    // Check folder exists if provided
    if (folderId && folderId !== 'root') {
      const folder = await prisma.mediaFolder.findUnique({
        where: { id: folderId }
      });
      if (!folder) {
        return res.status(400).json({
          success: false,
          message: 'Target folder does not exist.'
        });
      }
    }

    // Generate unique Key
    const fileExt = file.originalname.split('.').pop() || '';
    const originalNameWithoutExt = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
    const safeBaseName = originalNameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    const key = `${Date.now()}-${crypto.randomUUID()}-${safeBaseName}.${fileExt}`;

    // Upload to Cloudflare R2
    try {
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
      });
      await s3Client.send(command);
    } catch (s3Error: any) {
      console.error('Cloudflare R2 PutObjectCommand Failed:', s3Error);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file to storage bucket. Please check credentials.',
        error: s3Error.message
      });
    }

    // Create DB record
    const targetFolderId = folderId === 'root' || folderId === '' || folderId === null || folderId === undefined ? null : String(folderId);
    const mediaFile = await prisma.mediaFile.create({
      data: {
        folderId: targetFolderId,
        originalName: file.originalname,
        storedName: key,
        url: `${R2_PUBLIC_URL}/${key}`,
        mimeType: file.mimetype,
        size: file.size,
        altText: altText || null,
        caption: caption || null,
        description: description || null,
        uploadedBy: req.user!.id
      },
      include: {
        uploader: { select: { id: true, name: true } }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      data: mediaFile
    });
  } catch (error) {
    next(error);
  }
};

export const getFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { folderId } = req.query;

    const whereClause: any = {};
    if (folderId !== undefined) {
      whereClause.folderId = folderId === 'root' || folderId === '' ? null : String(folderId);
    }

    const files = await prisma.mediaFile.findMany({
      where: whereClause,
      include: {
        uploader: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const file = await prisma.mediaFile.findUnique({
      where: { id }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found.'
      });
    }

    // Delete from Cloudflare R2
    try {
      const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: file.storedName
      });
      await s3Client.send(command);
    } catch (s3Error: any) {
      console.error('Cloudflare R2 DeleteObjectCommand Failed:', s3Error);
      // We will continue DB deletion or warning depending on requirements, but blocking is standard
      return res.status(500).json({
        success: false,
        message: 'Failed to delete file from storage bucket. Database record remains intact.',
        error: s3Error.message
      });
    }

    // Delete record from DB
    await prisma.mediaFile.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const moveFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { folderId } = req.body;

    const file = await prisma.mediaFile.findUnique({
      where: { id }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found.'
      });
    }

    // Check folder exists if provided
    if (folderId && folderId !== 'root') {
      const folder = await prisma.mediaFolder.findUnique({
        where: { id: folderId }
      });
      if (!folder) {
        return res.status(400).json({
          success: false,
          message: 'Target folder does not exist.'
        });
      }
    }

    const targetFolderId = folderId === 'root' || folderId === '' || folderId === null ? null : String(folderId);
    const updated = await prisma.mediaFile.update({
      where: { id },
      data: {
        folderId: targetFolderId
      },
      include: {
        folder: { select: { id: true, name: true, path: true } }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'File moved successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
