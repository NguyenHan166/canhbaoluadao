import { Router } from 'express';
import { body, query } from 'express-validator';
import multer from 'multer';
import {
  getFolders,
  createFolder,
  deleteFolder,
  uploadFile,
  getFiles,
  deleteFile,
  moveFile,
} from './media.controller.js';
import { requireAuth, requireRoles } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validate.js';
import { logActivity } from '../../middlewares/audit.js';

const router = Router();

// Multer in-memory storage setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WEBP images and PDF documents are allowed.'));
    }
  },
});

// Roles allowed to manage media
const allowedMediaRoles = ['super_admin', 'editor', 'reviewer', 'report_manager'];

const validateFolder = [
  body('name').trim().notEmpty().withMessage('Folder name is required'),
  body('parentId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Parent ID must be a valid Mongo ID'),
  validateRequest,
];

const validateUpload = [
  body('folderId')
    .optional({ checkFalsy: true })
    .custom((val) => val === 'root' || /^[0-9a-fA-F]{24}$/.test(val))
    .withMessage('Folder ID must be a valid Mongo ID or "root"'),
  body('altText').optional().trim(),
  body('caption').optional().trim(),
  body('description').optional().trim(),
  validateRequest,
];

const validateGetFiles = [
  query('folderId')
    .optional({ checkFalsy: true })
    .custom((val) => val === 'root' || /^[0-9a-fA-F]{24}$/.test(val))
    .withMessage('Folder ID must be a valid Mongo ID or "root"'),
  validateRequest,
];

const validateMoveFile = [
  body('folderId')
    .custom((val) => val === 'root' || val === '' || val === null || /^[0-9a-fA-F]{24}$/.test(val))
    .withMessage('Folder ID must be a valid Mongo ID, null, or "root"'),
  validateRequest,
];

// Apply Auth and Role Check to all media routes
router.use(requireAuth, requireRoles(allowedMediaRoles));

// Folder Endpoints
router.get('/media/folders', getFolders);
router.post('/media/folders', validateFolder, logActivity('Tạo thư mục media'), createFolder);
router.delete('/media/folders/:id', logActivity('Xóa thư mục media'), deleteFolder);

// File Endpoints
router.post('/media/upload', upload.single('file'), validateUpload, logActivity('Upload tệp tin'), uploadFile);
router.get('/media/files', validateGetFiles, getFiles);
router.delete('/media/files/:id', logActivity('Xóa tệp tin'), deleteFile);
router.post('/media/files/:id/move', validateMoveFile, logActivity('Di chuyển tệp tin'), moveFile);

export default router;
