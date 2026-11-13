import mongoose from 'mongoose';

export const AUTH_PROVIDERS = ['email', 'google', 'github'];

// User: one account, tied to exactly one sign-in provider.
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'],
    },

    fullname: { type: String, required: true, trim: true, maxlength: 80 },

    emailVerified: { type: Boolean, default: false },

    // The single method used to sign in. `id` is the normalized email for
    // 'email', or the provider's user id for 'google' / 'github'.
    provider: {
      name: { type: String, enum: AUTH_PROVIDERS, required: true },
      id: { type: String, required: true, trim: true },
      _id: false,
    },

    // Only required for email/password sign-in; OAuth accounts have none.
    passwordHash: {
      type: String,
      select: false,
      required: [
        function () {
          return this.provider?.name === 'email';
        },
        'Password is required for email sign-in',
      ],
    },

    // Hashed password-reset token + expiry. The raw token is only ever
    // sent to the account owner; only its hash is stored here.
    passwordResetToken: {
      type: String,
      select: false,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
      default: null,
    },

    // Opaque refresh tokens (only SHA-256 hashes stored). Each entry is one
    // active session; refresh rotates the token, logout removes it.
    refreshTokens: {
      type: [
        {
          tokenHash: { type: String, required: true },
          expiresAt: { type: Date, required: true },
          _id: false,
        },
      ],
      select: false,
      default: [],
    },

    avatar: {
      url: { type: String, trim: true },
      key: { type: String, trim: true },
    },

    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false, autoIndex: false, autoCreate: false }
);

// A provider identity can belong to only one user
UserSchema.index(
  { 'provider.name': 1, 'provider.id': 1 },
  { name: 'provider_lookup', unique: true }
);

// Consistent API shape: `id` instead of `_id`, no version key, no secrets
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    if (ret._id) ret.id = ret._id.toString();
    delete ret._id;
    delete ret.passwordHash;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.refreshTokens;
    return ret;
  },
});
UserSchema.set('toObject', { virtuals: true });

const { model, models } = mongoose;

export default models.User || model('User', UserSchema);
