import { keys } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

// Central error handler - every error ends up here as JSON.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  // Mongoose validation errors (from the models)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message });
  }

  // Duplicate unique value (email, username, slug, provider link...)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'value';
    return res.status(409).json({ message: `Already exists: ${field}` });
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);

  res.status(status).json({
    message:
      status >= 500 && keys.server.environment === 'production'
        ? 'Internal server error'
        : err.message,
  });
}
