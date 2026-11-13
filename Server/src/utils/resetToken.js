import { createHash, randomBytes } from 'node:crypto';

// Password reset tokens: the raw token goes to the account owner (email /
// dev response), only its SHA-256 hash is stored in the database, so a
// database leak cannot be used to reset passwords.
export function generateResetToken() {
  return randomBytes(32).toString('hex');
}

export function hashResetToken(token) {
  return createHash('sha256').update(String(token)).digest('hex');
}

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
