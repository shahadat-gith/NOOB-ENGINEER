
import mongoose from 'mongoose';
import { toJSON, softDelete } from '../plugins/index.js';

const MAX_DEPTH = 4;

const CommentSchema = new mongoose.Schema(
    {
        article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        ancestors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        depth: { type: Number, default: 0, min: 0, max: MAX_DEPTH },

        body: { type: String, required: true, maxlength: 10000 },
        status: {
            type: String,
            enum: ['visible', 'flagged', 'hidden', 'deleted'],
            default: 'visible',
        },
        stats: { reactions: { type: Number, default: 0 } },
    },
    { timestamps: true }
);

CommentSchema.index(
    { article: 1, parent: 1, createdAt: 1 },
    { name: 'thread_page', partialFilterExpression: { deletedAt: null } }
);
CommentSchema.index({ ancestors: 1 });
CommentSchema.index({ user: 1, createdAt: -1 });

CommentSchema.pre('validate', async function (next) {
    if (!this.isModified('parent') || !this.parent) return next();

    const parent = await this.constructor
        .findById(this.parent, { ancestors: 1, depth: 1, article: 1, deletedAt: 1 })
        .lean();

    if (!parent) return next(new Error('Parent comment not found'));
    if (parent.deletedAt) return next(new Error('Cannot reply to a deleted comment'));
    if (!parent.article.equals(this.article)) {
        return next(new Error('Parent comment belongs to a different article'));
    }
    if (parent.depth + 1 > MAX_DEPTH) return next(new Error('Max thread depth exceeded'));

    this.ancestors = [...parent.ancestors, parent._id];
    this.depth = parent.depth + 1;
    next();
});

CommentSchema.plugin(softDelete);
CommentSchema.plugin(toJSON);

export default mongoose.model('Comment', CommentSchema);