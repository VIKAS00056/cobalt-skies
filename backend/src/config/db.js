import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`Attempting connection to external MongoDB...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`Could not connect to external MONGODB_URI: ${error.message}`);
      console.log(`Falling back to embedded in-memory MongoDB server for zero-cost operation...`);
    }
  } else {
    console.log(`No external MONGODB_URI provided. Initializing embedded in-memory MongoDB server (free zero-cost mode)...`);
  }

  // Fallback to MongoMemoryServer (Zero-cost free deployment mode)
  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`Embedded In-Memory MongoDB Connected at: ${memoryUri}`);
    return conn;
  } catch (memError) {
    console.error(`Failed to start embedded in-memory MongoDB: ${memError.message}`);
    throw memError;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
