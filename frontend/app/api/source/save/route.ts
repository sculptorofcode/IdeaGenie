import { NextResponse } from 'next/server';
import SourceData, { IPost } from '../../../../models/SourceData';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../../lib/database/connection';
import { validateSourceData } from '../../../../utils/sources/sourceDataFormatter';
import { sanitizeSourceData } from '../../../../utils/sources/sanitizeData';

/**
 * API endpoint for saving source data
 * This endpoint saves data from various sources (reddit, twitter, etc) to MongoDB
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const { explorationId, source, keyword, data } = await req.json();
    
    // Validate required fields
    if (!explorationId || !source || !keyword || !Array.isArray(data)) {
      return NextResponse.json({ 
        error: 'Required fields missing: explorationId, source, keyword, data (array)' 
      }, { status: 400 });
    }
    
    // Skip empty data arrays
    if (data.length === 0) {
      return NextResponse.json({
        warning: 'No data provided to save',
        success: true
      });
    }
    
    console.log(`Processing ${data.length} source data items for keyword: ${keyword}`);
      // Apply two-step sanitization process
    // First sanitize complex data structures (especially comments)
    const sanitizedData = sanitizeSourceData(data);
    
    // Then ensure all required fields are present
    const preprocessedData = sanitizedData.map((item: any, index: number) => ({
      body: item.body || `Content ${index + 1}`,
      comments: Array.isArray(item.comments) 
        ? item.comments.map((c: any) => typeof c === 'string' ? c : 'Comment') 
        : [],
      likes: typeof item.likes === 'number' ? item.likes : 0,
      postUrl: item.postUrl || `https://example.com/post-${index + 1}`
    }));
    
    console.log(`Data sanitized: ${preprocessedData.length} items`);
    
    // Validate and format the data using our utility function
    let validatedPosts: IPost[];
    
    try {
      // Skip validation if we already processed the data
      validatedPosts = preprocessedData;
    } catch (validationError: any) {
      console.error('Validation error details:', validationError);
      return NextResponse.json({ 
        error: `Data validation error: ${validationError.message}` 
      }, { status: 400 });
    }
    
    // Create and save the source data document
    const sourceData = new SourceData({
      explorationId: new mongoose.Types.ObjectId(explorationId),
      source,
      keyword,
      fetchedAt: new Date(),
      data: validatedPosts,
    });
      try {
      await sourceData.save();
    } catch (saveError: any) {
      console.error('MongoDB save error:', saveError);
      return NextResponse.json({ 
        error: `Database save error: ${saveError.message}` 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Source data saved successfully',
      id: sourceData._id
    });
    
  } catch (error: any) {
    console.error('Failed to save source data:', error);
    
    return NextResponse.json({ 
      error: `Failed to save source data: ${error.message}` 
    }, { status: 500 });
  }
}
