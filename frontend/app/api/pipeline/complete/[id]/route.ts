import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import KeywordExploration from '../../../../../models/KeywordExploration';

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

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const explorationId = params.id;
    
    if (!explorationId) {
      return NextResponse.json({ message: 'Exploration ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Mark exploration as complete
    await KeywordExploration.findByIdAndUpdate(
      explorationId,
      {
        completed: true,
        completedAt: new Date()
      }
    );
    
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
