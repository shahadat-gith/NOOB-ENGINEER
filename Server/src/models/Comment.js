import mongoose from 'mongoose';

export const MAX_DEPTH = 4;
export const COMMENT_STATUSES = ['visible', 'flagged', 'hidden', 'deleted'];

// Comment: threaded discussion on an article (replies nest via `parent`).
const CommentSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    ancestors: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    ],

    depth: { type: Number, default: 0, min: 0, max: MAX_DEPTH },

    body: { type: String, required: true, trim: true, maxlength: 10000 },

    status: {
      type: String,
      enum: COMMENT_STATUSES,
      default: 'visible',
    },

    stats: {
      reactions: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true, versionKey: false, autoIndex: false, autoCreate: false }
);

// Thread view: top-level comments / replies of one article, oldest first
CommentSchema.index(
  { article: 1, parent: 1, createdAt: 1 },
  { name: 'thread_page' }
);

// Whole subtree below a comment
CommentSchema.index({ ancestors: 1 }, { name: 'ancestors' });

// A user's own comments, newest first
CommentSchema.index({ user: 1, createdAt: -1 }, { name: 'user_comments' });

// Derive ancestors/depth from the parent comment (runs once per reply).
CommentSchema.pre('validate', async function () {
  if (!this.isModified('parent') || !this.parent) return;

  const parent = await this.constructor
    .findById(this.parent, { ancestors: 1, depth: 1, article: 1 })
    .lean();

  if (!parent) throw new Error('Parent comment not found');
  if (!parent.article.equals(this.article)) {
    throw new Error('Parent comment belongs to a different article');
  }
  if (parent.depth + 1 > MAX_DEPTH) {
    throw new Error('Max thread depth exceeded');
  }

  this.ancestors = [...parent.ancestors, parent._id];
  this.depth = parent.depth + 1;
});

// Consistent API shape: `id` instead of `_id`, no version key
CommentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    if (ret._id) ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
CommentSchema.set('toObject', { virtuals: true });

const { model, models } = mongoose;

export default models.Comment || model('Comment', CommentSchema);
