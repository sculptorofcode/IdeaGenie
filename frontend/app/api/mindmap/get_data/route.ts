import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Import utility functions
import { 
  fetchLatestUserExploration, 
  fetchInsightData, 
  fetchSourceData 
} from '../../../../utils/mindMapHelper';

// API route to get mindmap data for a user
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameter: userId' 
      }, { status: 400 });
    }

    // Connect to MongoDB if needed
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    try {
      const exploration = await fetchLatestUserExploration(userId);
      const insight = await fetchInsightData(exploration.explorationId);
      const sourceData = await fetchSourceData(exploration.explorationId);
      
      return NextResponse.json({
        success: true,
        data: {
          exploration,
          insight,
          sourceData
        }
      }, { status: 200 });
    } catch (error) {
      console.error("Data fetch error:", error);
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error with data fetching'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
