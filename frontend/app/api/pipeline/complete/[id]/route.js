import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    await mongoose.connect(uri);
  }
}

// Using direct MongoDB operations instead of Mongoose model to avoid type issues
export async function POST(request, { params }) {
  try {
    const explorationId = params.id;
    
    if (!explorationId) {
      return NextResponse.json({ message: 'Exploration ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Mark exploration as complete using MongoDB update query directly
    const result = await mongoose.connection.db
      .collection('keywordexplorations')
      .updateOne(
        { _id: new mongoose.Types.ObjectId(explorationId) },
        { 
          $set: { 
            completed: true,
            completedAt: new Date() 
          } 
        }
      );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Exploration not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Exploration marked as complete'
    });
  } catch (error) {
    console.error('Failed to mark exploration as complete:', error);
    return NextResponse.json({ 
      message: 'Failed to mark exploration as complete',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
