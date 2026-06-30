import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';

/**
 * Curried middleware to log administrative activities after a successful request completes (2xx status codes)
 */
export const logActivity = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      // Log only on successful administrative operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const user = req.user;
        if (!user) return;

        try {
          // Attempt to extract target record ID from params, body or query
          const targetId = req.params.id || req.body?.id || null;

          await prisma.auditLog.create({
            data: {
              userId: user.id,
              userEmail: user.email,
              userName: user.name,
              action,
              targetId: targetId ? String(targetId) : null,
            },
          });
        } catch (error) {
          console.error('[Audit Log Error]: Failed to record activity:', error);
        }
      }
    });

    next();
  };
};
