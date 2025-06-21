import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import KeywordExploration from '../../../../models/KeywordExploration';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { explorationId, subkeywords } = body;
    
    if (!explorationId) {
      return NextResponse.json({ message: 'Exploration ID is required' }, { status: 400 });
    }
    
    if (!subkeywords || !Array.isArray(subkeywords)) {
      return NextResponse.json({ message: 'Subkeywords array is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Update exploration with subkeywords
    await KeywordExploration.findByIdAndUpdate(
      explorationId,
      { subkeywords }
    );
    
    return NextResponse.json({ 
      message: 'Subkeywords added successfully'
    });
  } catch (error) {
    console.error('Failed to update subkeywords:', error);
    return NextResponse.json({ 
      message: 'Failed to update subkeywords',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
