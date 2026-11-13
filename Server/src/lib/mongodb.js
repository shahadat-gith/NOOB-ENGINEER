
import mongoose from 'mongoose';
import { keys } from '../config/env.js';
import dns from "dns"

if(keys.server.environment === "development") dns.setServers(["8.8.8.8"])

mongoose.set('strictQuery', true);
// No index building at import - Lambda cold starts must stay fast.
// Create indexes once out-of-band (e.g. Atlas) or via syncIndexes() in a migration.
mongoose.set('autoIndex', false);
mongoose.set('sanitizeFilter', true);

// Reuse connection across warm serverless invocations
let cached = globalThis.__mongoose;

if (!cached) {
  cached = globalThis.__mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDB() {
  // Already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Connection attempt already in progress
  if (!cached.promise) {
    cached.promise = mongoose.connect(keys.db.uri, {
      // Lambda opens one pool per concurrent invocation - keep it small.
      maxPoolSize: 5,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    }).then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        // Allow retry on next invocation
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
