import { api } from '../lib/axios.js';

// Profile endpoints for the signed-in user (/api/users).

export async function meApi() {
  const { data } = await api.get('/api/users/me');
  return data.user;
}

export async function updateProfileApi(fields) {
  const { data } = await api.patch('/api/users/me', fields);
  return data.user;
}
