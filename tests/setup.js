import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Tell app.js to load .env.test instead of .env when it calls dotenv.config().
// This runs before any beforeAll hooks, so the env is correct for the whole suite.
process.env.NODE_ENV = "test";

let mongoServer;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const inMemoryMongoUri = mongoServer.getUri();
    
    await mongoose.connect(inMemoryMongoUri, {
      family: 4
    });
  }
}, 30000);

afterAll(async () => {
  // Clear all collections BEFORE disconnecting so every test file starts clean.
  // We do this in afterAll (not afterEach) so state persists within a single file's
  // sequential tests (e.g. auth register → login must stay in the same DB state).
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({}).catch(err => console.error(`Error clearing ${key}:`, err));
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect().catch(err => console.error('Disconnect error:', err));
  }
  if (mongoServer) {
    await mongoServer.stop().catch(err => console.error('MongoServer stop error:', err));
  }
}, 10000);
