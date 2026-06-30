import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPublicArticles,
  getLatestArticles,
  getFeaturedArticles,
  getArticleBySlug,
  getAdminArticles,
  getAdminArticleById,
  createArticle,
  updateArticle,
  updateArticleStatus,
  deleteArticle,
} from './articles.controller.js';
import { requireAuth, requireRoles } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validate.js';
import { logActivity } from '../../middlewares/audit.js';

const router = Router();

const WARNING_LEVELS = ['normal', 'notice', 'warning', 'urgent', 'verified'];
const ARTICLE_STATUSES = ['draft', 'review', 'published', 'hidden', 'archived'];

const validateArticle = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('summary').trim().notEmpty().withMessage('Summary is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('categoryId').isMongoId().withMessage('Category ID must be a valid Mongo ID'),
  body('coverImageId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Cover Image ID must be a valid Mongo ID'),
  body('warningLevel')
    .isIn(WARNING_LEVELS)
    .withMessage(`Warning level must be one of: ${WARNING_LEVELS.join(', ')}`),
  body('sourceId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Source ID must be a valid Mongo ID'),
  body('sourceUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Source URL must be a valid URL'),
  body('status')
    .optional()
    .isIn(ARTICLE_STATUSES)
    .withMessage(`Status must be one of: ${ARTICLE_STATUSES.join(', ')}`),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  validateRequest,
];

const validateArticleUpdate = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('summary').optional().trim().notEmpty().withMessage('Summary cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('categoryId').optional().isMongoId().withMessage('Category ID must be a valid Mongo ID'),
  body('coverImageId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Cover Image ID must be a valid Mongo ID'),
  body('warningLevel')
    .optional()
    .isIn(WARNING_LEVELS)
    .withMessage(`Warning level must be one of: ${WARNING_LEVELS.join(', ')}`),
  body('sourceId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Source ID must be a valid Mongo ID'),
  body('sourceUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Source URL must be a valid URL'),
  body('status')
    .optional()
    .isIn(ARTICLE_STATUSES)
    .withMessage(`Status must be one of: ${ARTICLE_STATUSES.join(', ')}`),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  validateRequest,
];

const validateArticleStatus = [
  body('status')
    .isIn(ARTICLE_STATUSES)
    .withMessage(`Status must be one of: ${ARTICLE_STATUSES.join(', ')}`),
  validateRequest,
];

// Public routes
router.get('/public/articles', getPublicArticles);
router.get('/public/articles/latest', getLatestArticles);
router.get('/public/articles/featured', getFeaturedArticles);
router.get('/public/articles/:slug', getArticleBySlug);

// Admin routes (requires super_admin/editor)
router.get(
  '/admin/articles',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  getAdminArticles
);

router.get(
  '/admin/articles/:id',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  getAdminArticleById
);

router.post(
  '/admin/articles',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  validateArticle,
  logActivity('Tạo bài viết mới'),
  createArticle
);

router.patch(
  '/admin/articles/:id',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  validateArticleUpdate,
  logActivity('Cập nhật bài viết'),
  updateArticle
);

router.patch(
  '/admin/articles/:id/status',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  validateArticleStatus,
  logActivity('Cập nhật trạng thái bài viết nhanh'),
  updateArticleStatus
);

router.delete(
  '/admin/articles/:id',
  requireAuth,
  requireRoles(['super_admin', 'editor']),
  logActivity('Xóa bài viết'),
  deleteArticle
);

export default router;
