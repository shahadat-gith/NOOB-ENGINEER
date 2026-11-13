// models/Bookmark.js
import mongoose from 'mongoose';
import { toJSON } from '../plugins/index.js';

const BookmarkSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

BookmarkSchema.index({ user: 1, article: 1 }, { unique: true });
BookmarkSchema.index({ user: 1, createdAt: -1 });
BookmarkSchema.index({ article: 1 });

BookmarkSchema.plugin(toJSON);

export default mongoose.model('Bookmark', BookmarkSchema);