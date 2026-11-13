import User from '../models/User.js';
import { keys } from '../config/env.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from '../utils/resetToken.js';
import { signToken } from '../utils/jwt.js';
import { generateRefreshToken, hashRefreshToken, REFRESH_TOKEN_TTL_MS } from '../utils/refreshToken.js';
import { ApiError } from '../utils/apiError.js';
import {
  normalizeEmail,
  findUserByEmail,
  findUserByProvider,
  createUser,
  touchLastLogin,
} from './userService.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function assertOAuthConfigured(provider) {
  const providerKeys = keys.auth[provider];
  if (!providerKeys.clientId || !providerKeys.clientSecret) {
    throw new ApiError(501, `${provider} login is not configured on the server`);
  }
  if (!providerKeys.callbackUrl) {
    throw new ApiError(501, `${provider} callback URL is not configured - set ${provider.toUpperCase()}_CALLBACK_URL in .env`);
  }
}

export function oauthRedirectUri(provider) {
  // Exact URL registered in the provider console (env-overridable).
  return keys.auth[provider].callbackUrl;
}

// Issue a fresh access + refresh token pair for a user. The refresh token
// is stored hashed on the user document; expired entries are pruned.
async function issueTokens(user) {
  const refreshToken = generateRefreshToken();
  const now = new Date();

  const stored = await User.findById(user._id).select('+refreshTokens');
  const active = (stored?.refreshTokens || []).filter((t) => t.expiresAt > now);
  active.push({ tokenHash: hashRefreshToken(refreshToken), expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_MS) });
  await User.updateOne({ _id: user._id }, { refreshTokens: active });

  return { token: signToken(user._id), refreshToken };
}

// Exchange a valid refresh token for a new pair (rotates the token, so
// the presented one cannot be reused). User auth is not required - the
// token itself is the credential.
export async function refresh({ refreshToken }) {
  if (!refreshToken) throw new ApiError(400, 'Refresh token is required');

  const hash = hashRefreshToken(refreshToken);
  const user = await User.findOne({ 'refreshTokens.tokenHash': hash }).select('+refreshTokens');
  const entry = user?.refreshTokens?.find((t) => t.tokenHash === hash);
  if (!user || !entry || entry.expiresAt < new Date()) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== hash);
  await user.save({ validateBeforeSave: false });

  return { user, ...(await issueTokens(user)) };
}

// Revoke one refresh token (logout). Always succeeds, even if the token
// is unknown, so the endpoint cannot be used to probe sessions.
export async function logout({ refreshToken }) {
  if (refreshToken) {
    await User.updateOne(
      { 'refreshTokens.tokenHash': hashRefreshToken(refreshToken) },
      { $pull: { refreshTokens: { tokenHash: hashRefreshToken(refreshToken) } } }
    );
  }
  return {};
}

// ---------------------------------------------------------------------------
// Email + password
// ---------------------------------------------------------------------------

export async function register({ email, password, fullname }) {
  if (!email || !EMAIL_RE.test(normalizeEmail(email))) {
    throw new ApiError(400, 'A valid email is required');
  }
  if (!fullname?.trim()) throw new ApiError(400, 'Full name is required');
  if (!password || password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }

  const normalized = normalizeEmail(email);
  if (await findUserByEmail(normalized)) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await createUser({
    email: normalized,
    fullname,
    passwordHash: await hashPassword(password),
    provider: { name: 'email', id: normalized },
  });

  return { user, ...(await issueTokens(user)) };
}

export async function login({ email, password }) {
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  // +passwordHash: the field is `select: false`, so queries skip it by default.
  const user = await User.findOne({ email: normalizeEmail(email) }).select('+passwordHash');
  if (!user) throw new ApiError(401, 'Invalid email or password');

  if (user.provider?.name !== 'email' || !(await verifyPassword(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  await touchLastLogin(user);
  return { user, ...(await issueTokens(user)) };
}

// ---------------------------------------------------------------------------
// Password reset (forgot + reset)
// ---------------------------------------------------------------------------

// Always answers the same way, whether or not the email exists, so the
// endpoint cannot be used to check which emails have accounts.
// In development the raw token is included in the response (there is no
// email service yet) so the flow can be tested; in production the token
// must be delivered by email instead - see .env.example notes.
export async function forgotPassword({ email }) {
  if (!email) throw new ApiError(400, 'Email is required');

  const user = await User.findOne({ email: normalizeEmail(email) }).select('+passwordResetToken +passwordResetExpires');
  if (user) {
    const token = generateResetToken();
    user.passwordResetToken = hashResetToken(token);
    user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save({ validateBeforeSave: false });
    if (keys.server.environment !== 'production') return { token };
  }
  return {};
}

export async function resetPassword({ token, password }) {
  if (!token) throw new ApiError(400, 'Reset token is required');
  if (!password || password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }

  // Lookup by token only (no `$gt` date operator - sanitizeFilter would
  // mangle it), then check expiry in code.
  const user = await User.findOne({
    passwordResetToken: hashResetToken(token),
  }).select('+passwordResetToken +passwordResetExpires +passwordHash');

  if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
    throw new ApiError(400, 'Reset token is invalid or expired');
  }

  user.passwordHash = await hashPassword(password);
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  // Accounts have one provider, so resetting a password switches an
  // OAuth-only account to email sign-in.
  if (user.provider?.name !== 'email') {
    user.provider = { name: 'email', id: normalizeEmail(user.email) };
  }
  await user.save({ validateBeforeSave: false });
  return {};
}

// ---------------------------------------------------------------------------
// OAuth (Google / GitHub) - authorization code flow
// ---------------------------------------------------------------------------

export function buildAuthorizeUrl(provider) {
  assertOAuthConfigured(provider);
  const { clientId } = keys.auth[provider];
  const redirectUri = oauthRedirectUri(provider);

  if (provider === 'google') {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
      prompt: 'select_account',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    allow_signup: 'true',
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

async function exchangeCode(provider, code) {
  const { clientId, clientSecret } = keys.auth[provider];

  if (provider === 'google') {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: oauthRedirectUri('google'),
        grant_type: 'authorization_code',
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new ApiError(400, 'Google login failed - invalid or expired code');
    return data.access_token;
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: oauthRedirectUri('github'),
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new ApiError(400, 'GitHub login failed - invalid or expired code');
  }
  return data.access_token;
}

async function fetchGoogleProfile(accessToken) {
  const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new ApiError(400, 'Could not load your Google profile');
  const p = await res.json();
  return {
    providerId: p.sub,
    email: p.email,
    emailVerified: p.email_verified === true,
    fullname: p.name,
    avatarUrl: p.picture,
  };
}

async function fetchGithubProfile(accessToken) {
  const headers = { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' };

  const userRes = await fetch('https://api.github.com/user', { headers });
  if (!userRes.ok) throw new ApiError(400, 'Could not load your GitHub profile');
  const profile = await userRes.json();

  // Prefer a verified primary email; fall back to the first verified one,
  // then to a synthetic address so the account can still be saved.
  let email = profile.email;
  let emailVerified = Boolean(profile.email);
  if (!email) {
    const emailsRes = await fetch('https://api.github.com/user/emails', { headers });
    if (emailsRes.ok) {
      const emails = await emailsRes.json();
      const verified = emails.find((e) => e.verified && (e.primary || true));
      if (verified) {
        email = verified.email;
        emailVerified = true;
      }
    }
    if (!email) email = `${profile.id}+github@users.noreply.github.com`;
  }

  return {
    providerId: String(profile.id),
    email,
    emailVerified,
    fullname: profile.name || profile.login,
    avatarUrl: profile.avatar_url,
  };
}

// Find the existing account for an OAuth identity, or create a new one.
export async function findOrCreateOAuthUser(provider, profile) {
  // 1. Known provider identity.
  const existing = await findUserByProvider(provider, profile.providerId);
  if (existing) {
    await touchLastLogin(existing);
    return existing;
  }

  // 2. Same verified email as an existing account: sign in to that account
  // but keep its provider, so its current sign-in method keeps working.
  const email = normalizeEmail(profile.email);
  const byEmail = await findUserByEmail(email);
  if (byEmail) {
    if (!profile.emailVerified) {
      throw new ApiError(
        409,
        'An account with this email already exists. Sign in with your original method.'
      );
    }
    await touchLastLogin(byEmail);
    return byEmail;
  }

  // 3. Brand new account, with this provider as its single sign-in method.
  return createUser({
    email,
    fullname: profile.fullname || email.split('@')[0],
    provider: { name: provider, id: profile.providerId },
    emailVerified: profile.emailVerified,
    avatar: profile.avatarUrl ? { url: profile.avatarUrl } : undefined,
  });
}

export async function oauthLogin(provider, code) {
  assertOAuthConfigured(provider);
  const accessToken = await exchangeCode(provider, code);
  const profile =
    provider === 'google'
      ? await fetchGoogleProfile(accessToken)
      : await fetchGithubProfile(accessToken);
  const user = await findOrCreateOAuthUser(provider, profile);
  return { user, ...(await issueTokens(user)) };
}
