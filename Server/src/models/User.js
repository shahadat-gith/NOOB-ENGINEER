
import mongoose from 'mongoose';
import { toJSON, softDelete } from '../plugins/index.js';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'],
    },
    username: {
      type: String, unique: true, sparse: true, lowercase: true, trim: true,
      match: [/^[a-z0-9_-]{3,30}$/, 'Invalid username'],
    },
    fullname: { type: String, required: true, trim: true, maxlength: 80 },
    bio: { type: String, trim: true, maxlength: 500 },
    emailVerified: { type: Boolean, default: false },

    // Sign-in methods linked to this account. One user can have several.
    // id: for 'email' the normalized email; for 'google'/'github' the provider's user id.
    providers: [
      {
        name: { type: String, enum: ['email', 'google', 'github'], required: true },
        id: { type: String, required: true, trim: true },
        _id: false,
      },
    ],

    // Only required for email/password sign-in; OAuth-only accounts have none.
    passwordHash: {
      type: String,
      select: false,
      required: [function () { return this.providers.some((p) => p.name === 'email'); }, 'Password is required for email sign-in'],
    },
    avatar: {
        url: {type: String},
        key:{type: String}
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// A provider account can link to only one user
UserSchema.index({ 'providers.name': 1, 'providers.id': 1 }, { unique: true });

UserSchema.plugin(softDelete);
UserSchema.plugin(toJSON);

export default mongoose.model('User', UserSchema);