import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPublicSources,
  getAllSources,
  createSource,
  updateSource,
  deleteSource,
} from './sources.controller.js';
import { requireAuth, requireRoles } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validate.js';
import { logActivity } from '../../middlewares/audit.js';

const router = Router();

const validateSource = [
  body('name').trim().notEmpty().withMessage('Source name is required'),
  body('type').trim().notEmpty().withMessage('Source type is required'),
  body('website')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('logoId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Logo ID must be a valid Mongo ID'),
  body('trustStatus')
    .optional()
    .isIn(['verified', 'unverified'])
    .withMessage('Trust status must be verified or unverified'),
  validateRequest,
];

const validateSourceUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Source name cannot be empty'),
  body('type').optional().trim().notEmpty().withMessage('Source type cannot be empty'),
  body('website')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('logoId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Logo ID must be a valid Mongo ID'),
  body('trustStatus')
    .optional()
    .isIn(['verified', 'unverified'])
    .withMessage('Trust status must be verified or unverified'),
  validateRequest,
];

// Public routes
router.get('/public/sources', getPublicSources);

// Admin routes (super_admin, editor)
router.get(
  '/admin/sources',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  getAllSources
);

router.post(
  '/admin/sources',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  validateSource,
  logActivity('Tạo nguồn tin tham khảo'),
  createSource
);

router.patch(
  '/admin/sources/:id',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  validateSourceUpdate,
  logActivity('Cập nhật nguồn tin tham khảo'),
  updateSource
);

router.delete(
  '/admin/sources/:id',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  logActivity('Xóa nguồn tin tham khảo'),
  deleteSource
);

export default router;
