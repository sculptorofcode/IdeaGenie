import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI || '';

export default async function connectDB(): Promise<void> {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('Already connected to MongoDB');
      return;
    }
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
