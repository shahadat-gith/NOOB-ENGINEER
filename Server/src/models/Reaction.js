// models/Reaction.js
import mongoose from 'mongoose';
import { toJSON } from '../plugins/index.js';

const ReactionSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    kind: { type: String, enum: ['like', 'love', 'clap', 'insightful'], default: 'like' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// One reaction per user per article; changing kind updates the existing document
ReactionSchema.index({ user: 1, article: 1 }, { unique: true });
ReactionSchema.index({ article: 1, createdAt: -1 });

ReactionSchema.plugin(toJSON);

export default mongoose.model('Reaction', ReactionSchema);