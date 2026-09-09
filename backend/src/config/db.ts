import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shramsetu';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection failed or offline. Operating in fallback mock mode. Error: ${(error as Error).message}`);
  }
};
