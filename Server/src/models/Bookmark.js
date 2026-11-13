import mongoose from 'mongoose';

// Bookmark: a user saving an article to read later.
const BookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    autoIndex: false,
    autoCreate: false,
  }
);

// One bookmark per user per article
BookmarkSchema.index(
  { user: 1, article: 1 },
  { name: 'user_article', unique: true }
);

// A user's saved articles, newest first
BookmarkSchema.index(
  { user: 1, createdAt: -1 },
  { name: 'user_saved' }
);

// How many users saved an article
BookmarkSchema.index({ article: 1 }, { name: 'article_saves' });

// Consistent API shape: `id` instead of `_id`, no version key
BookmarkSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    if (ret._id) ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
BookmarkSchema.set('toObject', { virtuals: true });

const { model, models } = mongoose;

export default models.Bookmark || model('Bookmark', BookmarkSchema);
