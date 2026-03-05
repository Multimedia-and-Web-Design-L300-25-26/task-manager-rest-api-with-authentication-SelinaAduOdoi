import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in .env");
  }

  if (mongoUri.includes("<") || mongoUri.includes(">")) {
    throw new Error("MONGO_URI still contains placeholder text. Replace it with your real MongoDB password.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

export default connectDB;