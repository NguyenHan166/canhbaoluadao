import { Router } from 'express';
import { body } from 'express-validator';
import {
  getHandbooks,
  createHandbook,
  updateHandbook,
  deleteHandbook
} from './handbooks.controller.js';
import { requireAuth, requireRoles } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validate.js';
import { logActivity } from '../../middlewares/audit.js';

const router = Router();

const validateHandbook = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('summary').trim().notEmpty().withMessage('Summary is required'),
  body('steps').isArray().withMessage('Steps must be an array'),
  validateRequest
];

// Public routes
router.get('/public/handbooks', getHandbooks);

// Admin routes
router.get(
  '/admin/handbooks',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  getHandbooks
);

router.post(
  '/admin/handbooks',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  validateHandbook,
  logActivity('Tạo cẩm nang an toàn số'),
  createHandbook
);

router.patch(
  '/admin/handbooks/:id',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  logActivity('Cập nhật cẩm nang an toàn số'),
  updateHandbook
);

router.delete(
  '/admin/handbooks/:id',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  logActivity('Xóa cẩm nang an toàn số'),
  deleteHandbook
);

export default router;
