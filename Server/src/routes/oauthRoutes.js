import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  googleStart,
  googleCallback,
  githubStart,
  githubCallback,
} from '../controllers/authController.js';

// Mounted at /auth so the OAuth callback URLs match the provider settings
// exactly, without the /api prefix:
//   http://localhost:3000/auth/google/callback
//   https://api.noobengineer.in/auth/google/callback
// (The same handlers are also reachable via /api/auth for existing clients.)
const router = Router();

router.get('/google', googleStart);
router.get('/google/callback', asyncHandler(googleCallback));
router.get('/github', githubStart);
router.get('/github/callback', asyncHandler(githubCallback));

export default router;
