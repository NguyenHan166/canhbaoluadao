import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db.js';

export const getPublicSources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sources = await prisma.source.findMany({
      where: { trustStatus: 'verified' },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: sources,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sources = await prisma.source.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: sources,
    });
  } catch (error) {
    next(error);
  }
};

export const createSource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, type, website, logoId, description, trustStatus, note } = req.body;

    const source = await prisma.source.create({
      data: {
        name,
        type,
        website,
        logoId: logoId === '' || logoId === null ? null : logoId,
        description,
        trustStatus: trustStatus || 'unverified',
        note,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Source created successfully.',
      data: source,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, type, website, logoId, description, trustStatus, note } = req.body;

    // Check if source exists
    const source = await prisma.source.findUnique({
      where: { id },
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found.',
      });
    }

    const updated = await prisma.source.update({
      where: { id },
      data: {
        name,
        type,
        website,
        logoId: logoId === '' || logoId === null ? null : logoId,
        description,
        trustStatus,
        note,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Source updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if source exists
    const source = await prisma.source.findUnique({
      where: { id },
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found.',
      });
    }

    // Check if referenced by any articles
    const articleCount = await prisma.article.count({
      where: { sourceId: id },
    });

    if (articleCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete source because it is referenced by articles. Please reassign or delete those articles first.',
      });
    }

    await prisma.source.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Source deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
