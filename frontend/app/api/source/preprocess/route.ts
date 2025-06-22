import { NextResponse } from 'next/server';
import { IPost } from '../../../../models/SourceData';

/**
 * API endpoint for preprocessing source data to ensure it matches the required schema
 * This endpoint handles special cases like complex comments structures
 */
export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    
    if (!Array.isArray(data)) {
      return NextResponse.json({ 
        error: 'Data must be an array' 
      }, { status: 400 });
    }
    
    const preprocessedData: IPost[] = [];
    
    // Process each item
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      
      // Create a valid post object with default values
      const post: IPost = {
        body: '',
        comments: [],
        likes: 0,
        postUrl: ''
      };
      
      // Process the body field
      if (typeof item.body === 'string') {
        post.body = item.body;
      } else if (item.body && typeof item.body === 'object') {
        post.body = JSON.stringify(item.body).substring(0, 1000); // Limit length
      } else if (item.text || item.content) {
        post.body = String(item.text || item.content);
      } else {
        post.body = `Content item ${i+1}`;
      }
      
      // Process the likes field
      if (typeof item.likes === 'number') {
        post.likes = item.likes;
      } else if (typeof item.likes === 'string' && !isNaN(parseInt(item.likes))) {
        post.likes = parseInt(item.likes);
      } else if (item.score || item.upvotes || item.positive_reactions_count) {
        post.likes = Number(item.score || item.upvotes || item.positive_reactions_count || 0);
      }
      
      // Process the postUrl field
      if (typeof item.postUrl === 'string') {
        post.postUrl = item.postUrl;
      } else if (item.url || item.link || item.permalink) {
        post.postUrl = String(item.url || item.link || item.permalink);
      } else {
        post.postUrl = `https://example.com/post-${i}`;
      }
      
      // Process the comments field - this is the most problematic one
      if (Array.isArray(item.comments)) {
        // Handle each comment
        const processedComments: string[] = [];
        
        for (const comment of item.comments) {
          if (typeof comment === 'string') {
            // Simple string comment
            processedComments.push(comment);
          } else if (comment && typeof comment === 'object') {
            // Complex comment object
            try {
              let commentText = '';
              
              // Try to extract text from different possible fields
              if (comment.body && typeof comment.body === 'string') {
                commentText = comment.body;
              } else if (comment.text && typeof comment.text === 'string') {
                commentText = comment.text;
              } else if (comment.content && typeof comment.content === 'string') {
                commentText = comment.content;
              } else {
                // Create a simple representation of the comment
                const author = comment.author || comment.user || 'anonymous';
                const date = comment.date || comment.created_at || '';
                commentText = `Comment by ${author}${date ? ' on ' + date : ''}`;
              }
              
              // Remove HTML tags if present
              commentText = commentText.replace(/<[^>]*>?/gm, '');
              
              processedComments.push(commentText);
            } catch (err) {
              processedComments.push('Error processing comment');
            }
          }
        }
        
        post.comments = processedComments;
      } else {
        post.comments = [];
      }
      
      preprocessedData.push(post);
    }
    
    return NextResponse.json({
      success: true,
      data: preprocessedData
    });
    
  } catch (error: any) {
    console.error('Failed to preprocess data:', error);
    
    return NextResponse.json({ 
      error: `Preprocessing error: ${error.message}` 
    }, { status: 500 });
  }
}
