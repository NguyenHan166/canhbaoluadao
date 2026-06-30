import { Router } from 'express';
import { getAuditLogs } from './audit.controller.js';
import { requireAuth, requireRoles } from '../../middlewares/auth.js';

const router = Router();

router.get(
  '/audit-logs',
  requireAuth,
  requireRoles(['super_admin']),
  getAuditLogs
);

export default router;
