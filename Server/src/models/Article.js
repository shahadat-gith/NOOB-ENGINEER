import mongoose from 'mongoose';

export const ARTICLE_STATUSES = ['draft', 'published', 'archived'];

// Article: metadata + stats + the ordered list of its ArticleBlock ids.
// Block content itself lives in the ArticleBlock collection.
const ArticleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    subtitle: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // Subject classification
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 40,
      },
    ],

    // Blocks live in ArticleBlock; this array only stores their ids in
    // reading order. Fetch one article with `.populate('content.blocks')`;
    // feed/list queries can skip the populate and stay light.
    content: {
      blocks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ArticleBlock',
        },
      ],
    },

    stats: {
      views: { type: Number, default: 0, min: 0 },
      reactions: { type: Number, default: 0, min: 0 },
      comments: { type: Number, default: 0, min: 0 },
      bookmarks: { type: Number, default: 0, min: 0 },
    },

    status: {
      type: String,
      enum: ARTICLE_STATUSES,
      default: 'draft',
      index: true,
    },

    publishedAt: { type: Date, default: null },
    lastEditedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false, autoIndex: false, autoCreate: false }
);

// Published article feed
ArticleSchema.index(
  { publishedAt: -1 },
  { name: 'feed_published', partialFilterExpression: { status: 'published' } }
);

// Topic-specific article feed
ArticleSchema.index(
  { topics: 1, publishedAt: -1 },
  { name: 'topic_feed', partialFilterExpression: { status: 'published' } }
);

// Tag filtering
ArticleSchema.index({ tags: 1 }, { name: 'tags' });

// Full-text search (block text is indexed on ArticleBlock instead)
ArticleSchema.index(
  { title: 'text', subtitle: 'text' },
  { name: 'article_text', weights: { title: 10, subtitle: 5 } }
);

ArticleSchema.virtual('isPublished').get(function () {
  return this.status === 'published' && this.publishedAt != null;
});

// Keep lastEditedAt fresh on every change to the content
ArticleSchema.pre('save', function () {
  if (this.isModified('content')) this.lastEditedAt = new Date();
});

// Consistent API shape: `id` instead of `_id`, no version key
ArticleSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    if (ret._id) ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
ArticleSchema.set('toObject', { virtuals: true });

const { model, models } = mongoose;

export default models.Article || model('Article', ArticleSchema);
