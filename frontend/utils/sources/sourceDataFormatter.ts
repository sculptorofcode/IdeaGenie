import { IPost } from '../../models/SourceData';

/**
 * Validates and formats source data to ensure it matches the required schema
 * @param data - The raw source data
 * @returns Properly formatted source data
 */
export function validateSourceData(data: any[]): IPost[] {
  if (!Array.isArray(data)) {
    throw new Error('Source data must be an array');
  }
  
  return data.map(item => {
    // Ensure all required fields exist with proper types
    // Extract body text - handle both string and object formats
    let bodyText = '';
    if (typeof item.body === 'string') {
      bodyText = item.body;
    } else if (item.body && typeof item.body === 'object') {
      try {
        // Try to extract text from common properties
        bodyText = item.body.text || item.body.content || JSON.stringify(item.body);
      } catch {
        bodyText = 'Content extraction failed';
      }
    }
    
    // Process comments to ensure they're always simple strings
    let commentsArray: string[] = [];
    if (Array.isArray(item.comments)) {
      commentsArray = item.comments.map(comment => {
        // Handle string comments directly
        if (typeof comment === 'string') {
          return comment;
        }
        
        // Handle object comments by extracting text
        if (comment && typeof comment === 'object') {
          try {
            if (comment.body) {
              return typeof comment.body === 'string' 
                ? comment.body 
                : JSON.stringify(comment.body);
            } else if (comment.text) {
              return typeof comment.text === 'string'
                ? comment.text
                : JSON.stringify(comment.text);
            } else {
              // Extract meaningful properties
              const textProps = ['content', 'message', 'value'];
              for (const prop of textProps) {
                if (comment[prop] && typeof comment[prop] === 'string') {
                  return comment[prop];
                }
              }
              // Fallback: convert the whole object to a simple string
              return `Comment by ${comment.author || comment.user || 'unknown'}`;
            }
          } catch {
            return 'Comment processing failed';
          }
        }
        
        // Default fallback
        return 'Unknown comment format';
      });
    }
    
    const validItem: IPost = {
      body: bodyText || 'No content available',
      comments: commentsArray,
      likes: typeof item.likes === 'number' ? item.likes : 
             typeof item.likes === 'string' ? parseInt(item.likes, 10) || 0 : 
             (item.score || item.upvotes || item.reactions || 0),
      postUrl: typeof item.postUrl === 'string' ? item.postUrl : 
               (item.url || item.link || item.permalink || ''),
    };
    
    return validItem;
  });
}

/**
 * Process source data from various platforms (Reddit, Twitter/X, Dev.to, etc.)
 * and format it to match our schema
 * @param source - The data source ('reddit', 'x', 'devto', etc.)
 * @param data - The raw data from the source
 * @returns Properly formatted source data
 */
export async function processSourceData(source: string, data: any[]): Promise<IPost[]> {
  if (!Array.isArray(data)) {
    throw new Error('Source data must be an array');
  }

  let processedData: IPost[] = [];
  
  switch (source.toLowerCase()) {
    case 'reddit':
      processedData = data.map(post => ({
        body: post.selftext || post.title || '',
        comments: Array.isArray(post.comments) 
          ? post.comments.map(c => c.body || '')
          : [],
        likes: post.score || post.ups || 0,
        postUrl: `https://reddit.com${post.permalink || ''}`,
      }));
      break;
      
    case 'x':
    case 'twitter':
      processedData = data.map(tweet => ({
        body: tweet.text || tweet.full_text || '',
        comments: Array.isArray(tweet.replies) 
          ? tweet.replies.map(r => r.text || '')
          : [],
        likes: tweet.favorite_count || tweet.likes || 0,
        postUrl: `https://twitter.com/i/web/status/${tweet.id_str || tweet.id || ''}`,
      }));
      break;
      
    case 'devto':
      processedData = data.map(article => ({
        body: article.body_markdown || article.title || '',
        comments: Array.isArray(article.comments) 
          ? article.comments.map(c => c.body_html || c.body || '')
          : [],
        likes: article.positive_reactions_count || article.likes || 0,
        postUrl: article.url || '',
      }));
      break;
      
    default:
      // Generic processor for unknown sources
      processedData = data.map(item => ({
        body: String(item.body || item.content || item.text || ''),
        comments: Array.isArray(item.comments) 
          ? item.comments.map(c => String(
              typeof c === 'object' ? (c.body || c.text || JSON.stringify(c)) : c
            ))
          : [],
        likes: Number(item.likes || item.score || item.reactions || 0),
        postUrl: String(item.url || item.link || item.postUrl || ''),
      }));
      break;
  }
  
  return validateSourceData(processedData);
}
