import { Router } from 'express';
import { login, refresh, logout, me, googleLogin } from './auth.controller.js';
import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.post('/google', googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
