import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri) {
      console.log(`Connecting to MongoDB at configured URI...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }
  } catch (error) {
    console.warn(`Could not connect to configured MONGODB_URI: ${error.message}`);
    console.log(`Falling back to in-memory MongoDB server for smooth local development...`);
  }

  // Fallback to MongoMemoryServer
  try {
    console.log(`Starting Embedded In-Memory MongoDB Server...`);
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`Embedded In-Memory MongoDB Connected at: ${memoryUri}`);
    return conn;
  } catch (memError) {
    console.error(`Failed to start in-memory MongoDB: ${memError.message}`);
    throw memError;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
