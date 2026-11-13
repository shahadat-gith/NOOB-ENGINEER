import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  googleStart,
  googleCallback,
  githubStart,
  githubCallback,
} from '../controllers/authController.js';

const router = Router();

// Email + password
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password', asyncHandler(resetPassword));

// OAuth - start redirects to the provider, callback swaps the code for a token
router.get('/google', googleStart);
router.get('/google/callback', asyncHandler(googleCallback));
router.get('/github', githubStart);
router.get('/github/callback', asyncHandler(githubCallback));

export default router;
