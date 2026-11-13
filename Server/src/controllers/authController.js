import { keys } from '../config/env.js';
import { signState, verifyState } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';
import * as authService from '../services/authService.js';

// Controllers only translate HTTP <-> services. All business logic,
// validation and DB work lives in the services.

export async function register(req, res) {
  const { user, token, refreshToken } = await authService.register(req.body);
  res.status(201).json({ user, token, refreshToken });
}

export async function login(req, res) {
  const { user, token, refreshToken } = await authService.login(req.body);
  res.json({ user, token, refreshToken });
}

export async function refresh(req, res) {
  const { user, token, refreshToken } = await authService.refresh(req.body);
  res.json({ user, token, refreshToken });
}

export async function logout(req, res) {
  await authService.logout(req.body);
  res.json({ message: 'Logged out' });
}

export async function forgotPassword(req, res) {
  const result = await authService.forgotPassword(req.body);
  res.json({ message: 'If an account exists for that email, a password reset link has been sent.', ...result });
}

export async function resetPassword(req, res) {
  await authService.resetPassword(req.body);
  res.json({ message: 'Password has been reset. You can now sign in.' });
}

// ---------------------------------------------------------------------------
// OAuth
// ---------------------------------------------------------------------------

function oauthStart(provider) {
  return (req, res) => {
    const state = signState({ provider });
    const url = authService.buildAuthorizeUrl(provider);
    res.redirect(`${url}&state=${encodeURIComponent(state)}`);
  };
}

function oauthCallback(provider) {
  return async (req, res) => {
    const { code, state, error } = req.query;

    // Provider-side failure (user denied access, etc.) - never crash the flow.
    if (error) {
      if (keys.auth.frontendUrl) {
        return res.redirect(`${keys.auth.frontendUrl}/auth/callback?error=${encodeURIComponent(String(error))}`);
      }
      throw new ApiError(400, `${provider} login failed: ${error}`);
    }

    if (!code) throw new ApiError(400, `Missing ${provider} authorization code`);

    try {
      const payload = verifyState(state);
      if (payload.provider !== provider) throw new Error('provider mismatch');
    } catch {
      if (keys.auth.frontendUrl) {
        return res.redirect(`${keys.auth.frontendUrl}/auth/callback?error=invalid_state`);
      }
      throw new ApiError(400, 'Invalid or expired login state - please try again');
    }

    let tokens;
    try {
      tokens = await authService.oauthLogin(provider, code);
    } catch (err) {
      if (keys.auth.frontendUrl) {
        return res.redirect(`${keys.auth.frontendUrl}/auth/callback?error=${encodeURIComponent(err.message)}`);
      }
      throw err;
    }

    // SPA flow: hand the tokens to the frontend callback page.
    // Without FRONTEND_URL configured, return them as JSON instead.
    if (keys.auth.frontendUrl) {
      const q = new URLSearchParams({ token: tokens.token, refreshToken: tokens.refreshToken });
      return res.redirect(`${keys.auth.frontendUrl}/auth/callback?${q}`);
    }
    res.json({ token: tokens.token, refreshToken: tokens.refreshToken });
  };
}

export const googleStart = oauthStart('google');
export const googleCallback = oauthCallback('google');
export const githubStart = oauthStart('github');
export const githubCallback = oauthCallback('github');
