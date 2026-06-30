import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categories.controller.js';
import { requireAuth, requireRoles } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validate.js';
import { logActivity } from '../../middlewares/audit.js';

const router = Router();

const validateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('parentId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Parent ID must be a valid Mongo ID'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('IsVisible must be a boolean'),
  validateRequest,
];

const validateCategoryUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
  body('parentId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Parent ID must be a valid Mongo ID'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('IsVisible must be a boolean'),
  validateRequest,
];

// Public routes
router.get('/public/categories', getCategories);

// Admin routes (super_admin, editor)
router.post(
  '/admin/categories',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  validateCategory,
  logActivity('Tạo chuyên mục bài viết'),
  createCategory
);

router.patch(
  '/admin/categories/:id',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  validateCategoryUpdate,
  logActivity('Cập nhật chuyên mục bài viết'),
  updateCategory
);

router.delete(
  '/admin/categories/:id',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  logActivity('Xóa chuyên mục bài viết'),
  deleteCategory
);

export default router;
