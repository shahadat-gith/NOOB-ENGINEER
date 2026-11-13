import * as adminService from '../services/adminService.js';

// Controllers only translate HTTP <-> services (same pattern as the user
// controllers). The single admin comes from .env, not a database table.

export async function login(req, res) {
  const { token } = adminService.login(req.body);
  res.json({ admin: adminService.me(), token });
}

export async function me(req, res) {
  res.json({ admin: adminService.me() });
}
