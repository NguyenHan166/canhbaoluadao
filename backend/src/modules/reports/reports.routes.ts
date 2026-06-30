import { Router } from 'express';
import { body } from 'express-validator';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  updateReportRiskLevel,
  convertToArticle,
} from './reports.controller.js';
import { requireAuth, requireRoles } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validate.js';
import { logActivity } from '../../middlewares/audit.js';

const router = Router();

const validateReport = [
  body('caseType').trim().notEmpty().withMessage('Case type is required'),
  body('platform').trim().notEmpty().withMessage('Platform is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('suspectUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Suspect URL must be a valid URL'),
  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array of strings'),
  body('attachments.*')
    .optional()
    .isURL()
    .withMessage('Each attachment must be a valid URL'),
  validateRequest,
];

const validateStatus = [
  body('status')
    .isIn(['pending', 'checking', 'verified', 'insufficient', 'forwarded', 'converted'])
    .withMessage('Invalid report status'),
  validateRequest,
];

const validateRiskLevel = [
  body('riskLevel')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Risk level must be low, medium, high, or critical'),
  validateRequest,
];

// Public submission
router.post('/public/reports', validateReport, createReport);

// Admin endpoints (super_admin or report_manager)
router.get(
  '/admin/reports',
  requireAuth,
  requireRoles(['super_admin', 'report_manager']),
  getReports
);

router.get(
  '/admin/reports/:id',
  requireAuth,
  requireRoles(['super_admin', 'report_manager']),
  getReportById
);

router.patch(
  '/admin/reports/:id/status',
  requireAuth,
  requireRoles(['super_admin', 'report_manager']),
  validateStatus,
  logActivity('Cập nhật trạng thái báo cáo tin lừa đảo'),
  updateReportStatus
);

router.patch(
  '/admin/reports/:id/risk-level',
  requireAuth,
  requireRoles(['super_admin', 'report_manager']),
  validateRiskLevel,
  logActivity('Cập nhật mức độ rủi ro báo cáo tin lừa đảo'),
  updateReportRiskLevel
);

router.post(
  '/admin/reports/:id/convert-to-article',
  requireAuth,
  requireRoles(['super_admin', 'report_manager']),
  logActivity('Chuyển đổi báo cáo thành bài viết nháp'),
  convertToArticle
);

export default router;
