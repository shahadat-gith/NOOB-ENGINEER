import { createHash, randomBytes } from 'node:crypto';

// Refresh tokens are opaque random values (not JWTs). Only their SHA-256
// hash is stored on the User document, so a database leak cannot be used
// to mint new sessions. Each refresh rotates the token and the old one
// stops working (see services/authService.js -> refresh).
export function generateRefreshToken() {
  return randomBytes(48).toString('hex');
}

export function hashRefreshToken(token) {
  return createHash('sha256').update(String(token)).digest('hex');
}

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
