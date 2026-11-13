import { updateProfile } from '../services/userService.js';

// GET /api/users/me - the signed-in user's own profile (req.user from auth middleware)
export async function me(req, res) {
  res.json({ user: req.user });
}

// PATCH /api/users/me - update editable profile fields
export async function update(req, res) {
  const user = await updateProfile(req.user, req.body);
  res.json({ user });
}
