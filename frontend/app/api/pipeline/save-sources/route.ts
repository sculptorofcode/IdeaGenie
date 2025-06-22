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

    // Validate top-level fields
    if (!explorationId) {
      return NextResponse.json({ message: 'Exploration ID is required' }, { status: 400 });
    }
    if (!keyword) {
      return NextResponse.json({ message: 'Keyword is required' }, { status: 400 });
    }
    if (!source) {
      return NextResponse.json({ message: 'Source name is required' }, { status: 400 });
    }    // Debug logging
    console.log('Request data:', JSON.stringify({
      explorationId,
      keyword,
      source,
      dataLength: data?.length || 0
    }));
    
    // Check if data exists and is an array
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ message: 'No valid data items provided' }, { status: 400 });
    }
    
    // Log the first item to help debug
    if (data[0]) {
      console.log('First data item:', JSON.stringify({
        hasPostUrl: Boolean(data[0].postUrl),
        hasLikes: Boolean(data[0].likes),
        hasBody: Boolean(data[0].body),
        keys: Object.keys(data[0])
      }));
    }
    
    // Validate and sanitize data items
    const sanitizedData = data.map((item: any, index: number) => {
      // Parse comments if it's a string
      let commentsArr = [];
      if (typeof item.comments === 'string') {
        try {
          commentsArr = JSON.parse(item.comments);
        } catch (e) {
          commentsArr = [];
        }
      } else if (Array.isArray(item.comments)) {
        commentsArr = item.comments;
      }
      // Use default values instead of throwing errors
      return {
        postUrl: item.postUrl || `unknown-url-${index}`,
        likes: item.likes || 0,
        body: item.body || 'No content',
        comments: Array.isArray(commentsArr)
          ? commentsArr.map((comment: any) => ({
              id: comment.id || `comment-${Math.random().toString(36).substring(2, 9)}`,
              body: comment.body || 'No comment content',
              author: comment.author || 'Unknown author',
              created_at: comment.created_at ? new Date(comment.created_at) : new Date(),
              positive_reactions_count: comment.positive_reactions_count || 0,
              children: comment.children || []
            }))
          : []
      };
    });

    await connectToDatabase();

    const sourceData = new SourceData({
      explorationId,
      keyword,
      source,
      data: sanitizedData
    });

    await sourceData.save();

    return NextResponse.json({
      message: 'Source data saved successfully',
      sourceId: sourceData._id.toString()
    });

  } catch (error: any) {
    console.error('Failed to save source data:', error);
    return NextResponse.json({
      message: 'Failed to save source data',
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
