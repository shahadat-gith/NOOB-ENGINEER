import mongoose from 'mongoose';

export const BLOCK_TYPES = [
  'heading',
  'paragraph',
  'code',
  'mermaid',
  'callout',
  'quote',
  'image',
  'list',
  'table',
  'divider',
];

// Base block: fields every block has. Each concrete block type below is a
// discriminator on this model (same collection, `type` picks the shape),
// so Article.content.blocks can keep pointing at `ArticleBlock` and
// populate() returns the right shape for every entry.
const ArticleBlockBaseSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },

    // Discriminator key - set automatically by the concrete block model.
    type: { type: String, enum: BLOCK_TYPES, required: true },

    // Position within the article (Article.content.blocks order mirrors this)
    order: { type: Number, default: 0, min: 0 },
  },
  {
    discriminatorKey: 'type',
    timestamps: true,
    versionKey: false,
    autoIndex: false,
    autoCreate: false,
  }
);

// Fetch an article's blocks in reading order
ArticleBlockBaseSchema.index(
  { article: 1, order: 1 },
  { name: 'article_blocks' }
);

// Search inside block text. MongoDB allows only ONE text index per
// collection, so this lives on the base schema (shared by all block
// types), not on each discriminator.
ArticleBlockBaseSchema.index({ text: 'text' }, { name: 'block_text' });

// Consistent API shape: `id` instead of `_id`, no version key
ArticleBlockBaseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    if (ret._id) ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});
ArticleBlockBaseSchema.set('toObject', { virtuals: true });

const { model, models } = mongoose;

const ArticleBlock =
  models.ArticleBlock || model('ArticleBlock', ArticleBlockBaseSchema);

// Helper: create one discriminator (one block type) on the base model.
// `value` is the `type` string stored in MongoDB for that block.
function blockType(name, value, fields, indexes = []) {
  const existing = ArticleBlock.discriminators?.[name];
  if (existing) return existing;
  const schema = new mongoose.Schema(fields);
  for (const idx of indexes) schema.index(idx[0], idx[1]);
  return ArticleBlock.discriminator(name, schema, { value });
}

// Heading: text + level (1-6)
export const HeadingBlock = blockType('Heading', 'heading', {
  text: { type: String, required: true, trim: true, maxlength: 20000 },
  level: { type: Number, min: 1, max: 6, default: 2 },
});

// Paragraph: plain text
export const ParagraphBlock = blockType('Paragraph', 'paragraph', {
  text: { type: String, required: true, trim: true, maxlength: 20000 },
});

// Code: source code + language
export const CodeBlock = blockType('Code', 'code', {
  code: { type: String, required: true, maxlength: 100000 },
  language: { type: String, trim: true, lowercase: true, maxlength: 30 },
});

// Mermaid: diagram source (stored in `code`, rendered by the client)
export const MermaidBlock = blockType('Mermaid', 'mermaid', {
  code: { type: String, required: true, maxlength: 100000 },
  caption: { type: String, trim: true, maxlength: 500 },
});

// Callout: highlighted note / warning
export const CalloutBlock = blockType('Callout', 'callout', {
  text: { type: String, required: true, trim: true, maxlength: 20000 },
});

// Quote: text + optional attribution
export const QuoteBlock = blockType('Quote', 'quote', {
  text: { type: String, required: true, trim: true, maxlength: 20000 },
  attribution: { type: String, trim: true, maxlength: 500 },
});

// Image: hosted image + alt text and caption
export const ImageBlock = blockType('Image', 'image', {
  url: { type: String, required: true, trim: true },
  key: { type: String, trim: true },
  alt: { type: String, trim: true, maxlength: 500 },
  caption: { type: String, trim: true, maxlength: 500 },
});

// List: ordered or bulleted items
export const ListBlock = blockType('List', 'list', {
  items: {
    type: [{ type: String, trim: true, maxlength: 2000 }],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'list blocks require at least one item',
    },
  },
  ordered: { type: Boolean, default: false },
});

// Table: header row + body rows
export const TableBlock = blockType('Table', 'table', {
  headers: {
    type: [{ type: String, trim: true, maxlength: 200 }],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'table blocks require headers',
    },
  },
  rows: {
    type: [[String]],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'table blocks require rows',
    },
  },
});

// Divider: visual separator, no payload
export const DividerBlock = blockType('Divider', 'divider', {});

// Map of block `type` string -> its concrete model. Use this in routes:
//   const BlockModel = BLOCK_MODELS[req.body.type];
//   const block = await new BlockModel({ article: articleId, ...req.body.data });
export const BLOCK_MODELS = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  mermaid: MermaidBlock,
  callout: CalloutBlock,
  quote: QuoteBlock,
  image: ImageBlock,
  list: ListBlock,
  table: TableBlock,
  divider: DividerBlock,
};

export default ArticleBlock;
