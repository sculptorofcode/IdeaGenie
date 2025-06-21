import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
// Import and handle the model type properly
import KeywordExplorationModel, { IKeywordExploration } from '../../../../models/KeywordExploration';

// Ensure we have the correct Mongoose model type
const KeywordExploration = KeywordExplorationModel as mongoose.Model<IKeywordExploration>;

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
      // Validate and normalize the subkeywords data
    const validatedSubkeywords = subkeywords.map(kw => ({
      keyword: String(kw.keyword || ''),
      volume: Number(kw.volume || 0),
      cpc: Number(kw.cpc || 0),
      intent: String(kw.intent || 'Unknown'),
      competition: String(kw.competition || 'UNKNOWN'),
      trend: Array.isArray(kw.trend) ? kw.trend.map(t => ({
        month: String(t.month || ''),
        year: Number(t.year || new Date().getFullYear()),
        searches: Number(t.searches || 0)
      })) : []
    }));    // Find the exploration document
    const exploration = await KeywordExploration.findById(explorationId);
    
    if (!exploration) {
      return NextResponse.json({ message: 'Exploration not found' }, { status: 404 });
    }
    
    // Update the subkeywords array
    exploration.subkeywords = validatedSubkeywords;
    
    // Save the updated document
    await exploration.save();
    
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
