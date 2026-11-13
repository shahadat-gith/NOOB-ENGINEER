import jwt from 'jsonwebtoken';
import { keys } from '../config/env.js';

// Access tokens are stateless JWTs containing only the user id (`sub`).
// Refresh tokens are opaque values stored hashed on the User document
// (see utils/refreshToken.js) - they rotate on every use and are
// revoked by POST /api/auth/logout.
export function signToken(userId, extra = {}) {
  return jwt.sign({ sub: userId.toString(), ...extra }, keys.jwt.secret, {
    expiresIn: keys.jwt.expiresIn,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, keys.jwt.secret);
}

// Short-lived signed state for OAuth callbacks (CSRF protection).
export function signState(payload) {
  return jwt.sign(payload, keys.jwt.secret, { expiresIn: '10m' });
}

export function verifyState(state) {
  return jwt.verify(state, keys.jwt.secret);
}
