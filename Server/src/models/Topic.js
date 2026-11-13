// models/Topic.js
import mongoose from 'mongoose';
import { toJSON } from '../plugins/index.js';

const TopicSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 1000 },
    icon: { type: String, trim: true },
    coverImage: {
      url: { type: String },
      key: { type: String },
    },
    // 0 = subject (System Design, DBMS...), 1+ = sub-topic
    depth: { type: Number, default: 0, min: 0 },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
    ancestors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    sortOrder: { type: Number, default: 0 },
    articleCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TopicSchema.index({ parent: 1, sortOrder: 1 });
TopicSchema.index({ ancestors: 1 });
TopicSchema.index({ isActive: 1, depth: 1, sortOrder: 1 });

TopicSchema.plugin(toJSON);

export default mongoose.model('Topic', TopicSchema);