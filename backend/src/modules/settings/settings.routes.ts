import { Router } from 'express';
import { body } from 'express-validator';
import { getPublicSettings, updateSetting } from './settings.controller.js';
import { requireAuth, requireRoles } from '../../middlewares/auth.js';
import { logActivity } from '../../middlewares/audit.js';
import { validateRequest } from '../../middlewares/validate.js';

const router = Router();

const validateSetting = [
  body('key').trim().notEmpty().withMessage('Setting key is required'),
  body('value').notEmpty().withMessage('Setting value is required'),
  body('type').optional().isIn(['string', 'boolean', 'number', 'json']).withMessage('Setting type must be string, boolean, number, or json'),
  validateRequest
];

router.get('/public/settings', getPublicSettings);

router.patch(
  '/admin/settings',
  requireAuth,
  requireRoles(['super_admin']),
  validateSetting,
  logActivity('Cập nhật cấu hình hệ thống'),
  updateSetting
);

export default router;
