/**
 * Utility for sanitizing complex source data
 * Specifically focused on handling comment structures that cause MongoDB validation errors
 */

import { IPost } from '../../models/SourceData';

/**
 * Safely extracts text content from HTML or rich text
 * @param html HTML or rich text content
 * @returns Plain text with HTML tags removed
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  
  try {
    // Remove HTML tags
    return html.replace(/<\/?[^>]+(>|$)/g, ' ')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    return html;
  }
}

/**
 * Safely convert a complex comment object to a string
 * @param comment The comment object or string
 * @returns A sanitized string version of the comment
 */
export function sanitizeComment(comment: any): string {
  if (typeof comment === 'string') {
    return stripHtml(comment);
  }
  
  if (comment && typeof comment === 'object') {
    try {
      // Try common property names for comment text
      if (comment.body) {
        return typeof comment.body === 'string' 
          ? stripHtml(comment.body) 
          : 'Complex comment structure';
      }
      
      if (comment.text) {
        return typeof comment.text === 'string'
          ? stripHtml(comment.text)
          : 'Complex comment structure';
      }
      
      // Try to create a descriptive string
      const author = comment.author || comment.user || 'Anonymous';
      const date = comment.created_at || comment.date || '';
      
      return `Comment by ${author}${date ? ' on ' + date : ''}`;
    } catch {
      // Fallback for any errors during extraction
      return 'Comment data processing error';
    }
  }
  
  return 'Unknown comment format';
}

/**
 * Fix source data with complex comment structures
 * @param posts Array of post data that might have complex comments
 * @returns Sanitized post data ready for MongoDB
 */
export function fixComplexComments(posts: any[]): IPost[] {
  if (!Array.isArray(posts)) return [];
  
  return posts.map((post, index) => {
    // Ensure we have valid post structure
    const sanitizedPost: IPost = {
      body: typeof post.body === 'string' ? post.body : `Post ${index + 1} content`,
      likes: typeof post.likes === 'number' ? post.likes : 0,
      postUrl: typeof post.postUrl === 'string' ? post.postUrl : `https://example.com/post-${index}`,
      comments: []
    };
    
    // Process comments if they exist
    if (Array.isArray(post.comments)) {
      sanitizedPost.comments = post.comments.map(sanitizeComment);
    }
    
    return sanitizedPost;
  });
}

/**
 * Sanitize entire source data document to ensure MongoDB compatibility
 * @param data Raw source data
 * @returns Sanitized data ready for MongoDB
 */
export function sanitizeSourceData(data: any): any {
  if (!data) return null;
  
  // Deep clone to avoid modifying the original
  const result = JSON.parse(JSON.stringify(data));
  
  // If data is an array of posts
  if (Array.isArray(result)) {
    return fixComplexComments(result);
  }
  
  // If data is a source data document with a data array
  if (result.data && Array.isArray(result.data)) {
    result.data = fixComplexComments(result.data);
    return result;
  }
  
  return result;
}
