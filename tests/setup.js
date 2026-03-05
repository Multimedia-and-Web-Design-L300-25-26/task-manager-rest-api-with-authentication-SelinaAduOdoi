import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Ensure test environment variables are loaded before route handlers execute.
process.env.NODE_ENV = "test";
dotenv.config({ path: ".env.test" });

let mongoServer;

beforeAll(async () => {
	// Create ephemeral MongoDB instance so tests run without external DB service.
	mongoServer = await MongoMemoryServer.create();
	const inMemoryMongoUri = mongoServer.getUri();

	// Ensure app/middleware reads the same URI during test execution.
	process.env.MONGO_URI = inMemoryMongoUri;

	// Open a single MongoDB connection for the full test suite.
	await mongoose.connect(inMemoryMongoUri);
});

afterEach(async () => {
	// Clear all collections so tests remain isolated and deterministic.
	const { collections } = mongoose.connection;
	const deletePromises = Object.values(collections).map((collection) => collection.deleteMany({}));
	await Promise.all(deletePromises);
});

afterAll(async () => {
	// Close DB connection and shut down in-memory server to prevent open handles.
	await mongoose.connection.close();
	if (mongoServer) {
		await mongoServer.stop();
	}
});