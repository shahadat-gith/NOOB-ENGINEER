import mongoose from 'mongoose';

// Topic: a subject (System Design, DBMS, ...) or a sub-topic under one.
const TopicSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: { type: String, required: true, trim: true },

    description: { type: String, trim: true, maxlength: 1000 },

    icon: { type: String, trim: true },

    coverImage: {
      url: { type: String, trim: true },
      key: { type: String, trim: true },
    },

    // 0 = subject (System Design, DBMS...), 1+ = sub-topic
    depth: { type: Number, default: 0, min: 0 },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null,
    },

    ancestors: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    ],

    sortOrder: { type: Number, default: 0 },

    articleCount: { type: Number, default: 0, min: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, autoIndex: false, autoCreate: false }
);

TopicSchema.index({ parent: 1, sortOrder: 1 }, { name: 'parent_sort' });
TopicSchema.index({ ancestors: 1 }, { name: 'ancestors' });
TopicSchema.index(
  { isActive: 1, depth: 1, sortOrder: 1 },
  { name: 'active_tree' }
);

// Consistent API shape: `id` instead of `_id`, no version key
TopicSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    if (ret._id) ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
TopicSchema.set('toObject', { virtuals: true });

const { model, models } = mongoose;

export default models.Topic || model('Topic', TopicSchema);
