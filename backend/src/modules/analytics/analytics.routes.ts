import { Router } from 'express';
import { getOverviewStats } from './analytics.controller.js';
import { requireAuth, requireRoles } from '../../middlewares/auth.js';

const router = Router();

// Allow all admin staff to read stats
const allowedAnalyticsRoles = ['super_admin', 'editor', 'reviewer', 'report_manager'];

router.get(
  '/analytics/overview',
  requireAuth,
  requireRoles(allowedAnalyticsRoles),
  getOverviewStats
);

export default router;
