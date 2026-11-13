// One-time setup: creates the database, collections and all indexes
// defined in the models. Run with:  node scripts/init-db.js
// Safe to run again - syncIndexes() is a no-op when indexes already match.
import mongoose from 'mongoose';
import { connectToDB } from '../src/lib/mongodb.js';
import Article from '../src/models/Article.js';
import ArticleBlock, { BLOCK_MODELS } from '../src/models/ArticleBlock.js';
import Topic from '../src/models/Topic.js';
import User from '../src/models/User.js';
import Comment from '../src/models/Comment.js';
import Reaction from '../src/models/Reaction.js';
import Bookmark from '../src/models/Bookmark.js';

const models = [Article, ArticleBlock, Topic, User, Comment, Reaction, Bookmark];

async function main() {
  const conn = await connectToDB();
  console.log('Connected to database:', conn.connection.name);

  // Drop a stale per-type text index if an older model version created
  // one - MongoDB allows only one text index per collection, and the
  // shared `block_text` index on the base schema replaces it.
  const oldTextIndex = (await ArticleBlock.collection.listIndexes().toArray())
    .find((i) => i.name === 'block_text' && i.partialFilterExpression);
  if (oldTextIndex) {
    await ArticleBlock.collection.dropIndex('block_text');
    console.log('Dropped stale partial block_text index (replaced by shared one)');
  }

  // Discriminator models share ArticleBlock's collection but carry their
  // own indexes - sync those too.
  models.push(...Object.values(BLOCK_MODELS));

  for (const model of models) {
    await model.syncIndexes();
    const indexes = await model.collection.listIndexes().toArray();
    console.log(`${model.modelName}: ${indexes.length} indexes -> ${indexes.map((i) => i.name).join(', ')}`);
  }

  const collections = await conn.connection.db.listCollections().toArray();
  console.log('\nCollections in this database:');
  for (const c of collections) console.log(' -', c.name);
}

main()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('init-db failed:', error.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  });
