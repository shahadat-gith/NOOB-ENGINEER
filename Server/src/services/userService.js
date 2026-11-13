import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

export function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

export async function findUserByEmail(email) {
  return User.findOne({ email: normalizeEmail(email) });
}

export async function findUserByProvider(name, id) {
  return User.findOne({ 'provider.name': name, 'provider.id': String(id) });
}

const PROFILE_FIELDS = ['fullname', 'avatar'];

// Update editable profile fields only - never email/provider/password here.
export async function updateProfile(user, data) {
  const unknown = Object.keys(data).filter((k) => !PROFILE_FIELDS.includes(k));
  if (unknown.length) throw new ApiError(400, `Cannot update field(s): ${unknown.join(', ')}`);

  if (data.fullname !== undefined) {
    if (!String(data.fullname).trim()) throw new ApiError(400, 'Full name is required');
    user.fullname = String(data.fullname).trim();
  }

  if (data.avatar !== undefined) {
    user.avatar = {
      url: String(data.avatar?.url || '').trim() || undefined,
      key: String(data.avatar?.key || '').trim() || undefined,
    };
  }

  await user.save();
  return user;
}

export async function touchLastLogin(user) {
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
}

// Create a fresh account (shared by email signup and first-time OAuth login).
export async function createUser({ email, fullname, passwordHash, provider, emailVerified = false, avatar }) {
  const user = new User({
    email: normalizeEmail(email),
    fullname: String(fullname).trim(),
    passwordHash,
    provider,
    emailVerified,
    avatar,
  });
  await user.save();
  return user;
}
