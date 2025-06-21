import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LLMInsight from '../../../../models/LLMInsight';

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

/**
 * Helper function to extract numbered items from text sections
 */
function extractNumberedItems(text: string): string[] {
  if (!text) return [];
  
  // Remove section title (e.g., "PROBLEMS:")
  const cleanText = text.replace(/^[^:]*:\s*/i, '');
  
  // Look for numbered patterns like "1. Item" or "1) Item"
  const matches = cleanText.match(/(?:\d+[\.\)]\s*[^0-9\n]+|\n\s*-\s*[^\n]+)/g);
  
  if (!matches) return [cleanText.trim()]; // Return the whole text if no numbered items
  
  return matches.map(item => 
    item.replace(/^\s*\d+[\.\)]\s*|-\s*/g, '').trim()
  ).filter(item => item.length > 0);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { explorationId, geminiResponse } = body;
    
    if (!explorationId) {
      return NextResponse.json({ message: 'Exploration ID is required' }, { status: 400 });
    }
    
    if (!geminiResponse) {
      return NextResponse.json({ message: 'Gemini response is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Parse response to extract problems and product ideas
    const problemsMatch = geminiResponse.match(/PROBLEMS:[\s\S]*?(?=\n\s*\n\s*\d+\.|$)/i);
    const productsMatch = geminiResponse.match(/PRODUCT IDEAS:[\s\S]*?(?=\n\s*\n\s*\d+\.|$)/i);
    const sentimentMatch = geminiResponse.match(/SENTIMENT:[\s\S]*?(?=\n\s*\n|$)/i);
    
    const problems = extractNumberedItems(problemsMatch ? problemsMatch[0] : '');
    const productIdeas = extractNumberedItems(productsMatch ? productsMatch[0] : '');
    const sentiment = sentimentMatch ? sentimentMatch[0].replace(/SENTIMENT:\s*/i, '').trim() : '';
    
    // Save to database
    const insight = await LLMInsight.create({
      explorationId,
      rawResponse: geminiResponse,
      problems,
      productIdeas,
      sentiment,
      status: 'completed',
      createdAt: new Date()
    });
    
    return NextResponse.json({
      message: 'LLM insights saved successfully',
      insightId: insight._id.toString()
    });
  } catch (error) {
    console.error('Failed to save LLM insights:', error);
    return NextResponse.json({ 
      message: 'Failed to save LLM insights',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
