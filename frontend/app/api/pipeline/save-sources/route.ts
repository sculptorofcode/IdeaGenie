import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SourceData from '../../../../models/SourceData';

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
    const { explorationId, keyword, source, data } = body;
    
    if (!explorationId) {
      return NextResponse.json({ message: 'Exploration ID is required' }, { status: 400 });
    }
    
    if (!keyword) {
      return NextResponse.json({ message: 'Keyword is required' }, { status: 400 });
    }
    
    if (!source) {
      return NextResponse.json({ message: 'Source name is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Save source data
    const sourceData = new SourceData({
      explorationId,
      keyword,
      source,
      data: data || []
    });
    await sourceData.save();
    
    return NextResponse.json({ 
      message: 'Source data saved successfully',
      sourceId: sourceData._id.toString()
    });
  } catch (error) {
    console.error('Failed to save source data:', error);
    return NextResponse.json({ 
      message: 'Failed to save source data',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
