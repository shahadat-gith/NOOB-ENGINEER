import { Router } from 'express';
import { authenticateAdmin } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { login, me } from '../controllers/adminController.js';

const router = Router();

// Public admin auth (single admin from .env - see services/adminService.js)
router.post('/login', asyncHandler(login));

// Protected admin routes
router.get('/me', authenticateAdmin, asyncHandler(me));

export default router;
