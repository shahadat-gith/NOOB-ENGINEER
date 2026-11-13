import mongoose from 'mongoose';

export const REACTION_KINDS = ['like', 'love', 'clap', 'insightful'];

// Reaction: a user's single reaction (like / love / ...) on an article.
const ReactionSchema = new mongoose.Schema(
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

    kind: {
      type: String,
      enum: REACTION_KINDS,
      default: 'like',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    autoIndex: false,
    autoCreate: false,
  }
);

// One reaction per user per article; changing kind updates the same document
ReactionSchema.index(
  { user: 1, article: 1 },
  { name: 'user_article', unique: true }
);

// Latest reactions on an article
ReactionSchema.index(
  { article: 1, createdAt: -1 },
  { name: 'article_latest' }
);

// Consistent API shape: `id` instead of `_id`, no version key
ReactionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    if (ret._id) ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
ReactionSchema.set('toObject', { virtuals: true });

const { model, models } = mongoose;

export default models.Reaction || model('Reaction', ReactionSchema);
