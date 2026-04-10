import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pollclass';

export async function connectDB(): Promise<typeof mongoose> {
  try {
    return await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
}