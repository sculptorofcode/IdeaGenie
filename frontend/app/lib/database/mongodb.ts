import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI || '';

export default async function connectDB(): Promise<void> {
  try {
    // Check for existing connection
    if (mongoose.connections[0].readyState) {
      console.log('Already connected to MongoDB (readyState:', mongoose.connections[0].readyState, ')');
      return;
    }
    
    // Check for MongoDB URI
    if (!MONGODB_URI) {
      console.error('MongoDB URI is missing!');
      throw new Error('MONGODB_URI is not defined in environment variables');
    } else {
      console.log('MongoDB URI found. Length:', MONGODB_URI.length);
    }
    
    // Set strictQuery to false (will be default in Mongoose 7)
    mongoose.set('strictQuery', false);
    
    // Configure connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 45000, // 45 seconds
    };

    // Connect to MongoDB
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Add connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    throw error;
  }
}
