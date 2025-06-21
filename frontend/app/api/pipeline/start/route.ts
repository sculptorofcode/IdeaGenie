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
    const { userId, mainKeyword, country } = body;
      if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    
    // Validate that this is a proper auth ID, not a generated one
    if (userId.startsWith('user-')) {
      return NextResponse.json({ 
        message: 'Valid authenticated user ID is required. Please sign in.' 
      }, { status: 401 });
    }
    
    if (!mainKeyword) {
      return NextResponse.json({ message: 'Main keyword is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    // Create exploration record with proper ObjectId handling
    const exploration = new KeywordExploration({
      userId: new mongoose.Types.ObjectId(userId),
      mainKeyword,
      country: country || 'en-US',
      sourcesScraped: [],
      completed: false
    });
    
    await exploration.save();
    
    return NextResponse.json({ 
      message: 'Exploration started successfully', 
      explorationId: exploration._id.toString() 
    });
  } catch (error) {
    console.error('Failed to start exploration:', error);
    return NextResponse.json({ 
      message: 'Failed to start exploration',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
