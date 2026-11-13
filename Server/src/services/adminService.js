import { timingSafeEqual } from 'node:crypto';
import { keys } from '../config/env.js';
import { signToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';

// There is no Admin model or database table - the single admin is defined
// by ADMIN_EMAIL / ADMIN_PASSWORD in .env (see .env.example).

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a ?? ''));
  const bufB = Buffer.from(String(b ?? ''));
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function login({ email, password }) {
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const emailOk = safeEqual(String(email).trim().toLowerCase(), keys.admin.email);
  const passwordOk = safeEqual(password, keys.admin.password);
  if (!emailOk || !passwordOk) throw new ApiError(401, 'Invalid email or password');

  return { token: signToken('admin', { role: 'admin' }) };
}

export function me() {
  return { email: keys.admin.email };
}
