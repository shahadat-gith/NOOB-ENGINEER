
import mongoose from 'mongoose';
import { toJSON, softDelete } from '../plugins/index.js';

const STATUS = ['draft', 'published', 'archived'];

const ArticleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    subtitle: { type: String, maxlength: 300 },
    summary: { type: String, maxlength: 500 },

    // Subject classification: System Design, DBMS, OS, CN... (Topic tree)
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    tags: [{ type: String, lowercase: true, trim: true, maxlength: 40 }],

    content: {
      markdown: { type: String, required: true },
      html: { type: String, default: '' },
      renderedAt: Date,
      hash: String,
    },

    status: { type: String, enum: STATUS, default: 'draft' },

    metadata: {
      components: [{ type: String }],
      tradeoffs: [{ type: String }],
      interviewQuestions: [{ type: String }],
      sources: [{ label: String, url: String }],
    },

    stats: {
      views: { type: Number, default: 0 },
      reactions: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      bookmarks: { type: Number, default: 0 },
    },

    publishedAt: { type: Date, default: null },
    lastEditedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ArticleSchema.index(
  { publishedAt: -1 },
  { name: 'feed_published', partialFilterExpression: { status: 'published', deletedAt: null } }
);
// Topic pages: newest published articles for a topic
ArticleSchema.index(
  { topics: 1, publishedAt: -1 },
  { name: 'topic_feed', partialFilterExpression: { status: 'published', deletedAt: null } }
);
ArticleSchema.index({ tags: 1 });

ArticleSchema.index(
  { title: 'text', summary: 'text', 'content.markdown': 'text' },
  {
    name: 'article_text',
    weights: { title: 10, summary: 5, 'content.markdown': 1 },
    default_language: 'english',
  }
);

ArticleSchema.virtual('isPublished').get(function () {
  return this.status === 'published' && this.publishedAt != null;
});


ArticleSchema.plugin(softDelete);
ArticleSchema.plugin(toJSON);

export default mongoose.model('Article', ArticleSchema);