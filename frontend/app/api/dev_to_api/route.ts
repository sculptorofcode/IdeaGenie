import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

// Types
interface DevToUser {
  username?: string;
}

interface DevToComment {
  id_code: string;
  body_html?: string;
  body_markdown?: string;
  user?: DevToUser;
  created_at: string;
  positive_reactions_count?: number;
  parent?: { id_code: string };
}

interface NestedComment {
  id: string;
  body: string;
  author: string;
  created_at: string;
  positive_reactions_count: number;
  children: NestedComment[];
}

interface DevToPost {
  title: string;
  url: string;
  author: string;
  published_at: string;
  description: string;
  comments_count: number;
  positive_reactions_count: number;
  tags: string[];
  id: number | string;
  comments: NestedComment[];
}

// Function to organize comments into nested structure
function organizeComments(comments: DevToComment[]): NestedComment[] {
  const commentMap = new Map<string, NestedComment>();
  const rootComments: NestedComment[] = [];

  // First pass: create comment objects and map them by ID
  comments.forEach(comment => {
    const commentObj: NestedComment = {
      id: comment.id_code,
      body: comment.body_html || comment.body_markdown || '',
      author: comment.user?.username || 'Unknown',
      created_at: comment.created_at,
      positive_reactions_count: comment.positive_reactions_count || 0,
      children: []
    };
    commentMap.set(comment.id_code, commentObj);
  });

  // Second pass: organize into parent-child relationships
  comments.forEach(comment => {
    const commentObj = commentMap.get(comment.id_code)!;
    if (comment.parent && commentMap.has(comment.parent.id_code)) {
      // This is a nested comment
      const parentComment = commentMap.get(comment.parent.id_code)!;
      parentComment.children.push(commentObj);
    } else {
      // This is a root comment
      rootComments.push(commentObj);
    }
  });

  return rootComments;
}

export async function fetchDevToPosts(keyword: string | null, tag: string | null, limit: number = 10): Promise<DevToPost[]> {
    try {
        let response;
        // If keyword is provided, use Dev.to search API
        if (keyword) {
            const searchUrl = `https://dev.to/search/feed_content?per_page=${limit}&page=0&search_fields=title&approved=&class_name=Article&sort_by=hotness_score&sort_direction=desc&tag_names%5B%5D=&tag_boolean_mode=all&user_id=&published_at%5Bgte%5D=&published_at%5Blte%5D=&q=${encodeURIComponent(keyword)}`;
            response = await axios.get(searchUrl, {
                headers: {
                    Accept: 'application/json',
                    'User-Agent': 'DevToFetcher/1.0',
                },
            });
        } else {
            // Build the Dev.to API URL with search parameters
            let devToUrl = `https://dev.to/api/articles?per_page=${limit}`;
            if (tag) {
                devToUrl += `&tag=${encodeURIComponent(tag)}`;
            }
            response = await axios.get(devToUrl, {
                headers: {
                    Accept: 'application/json',
                    'User-Agent': 'DevToFetcher/1.0',
                },
            });
        }

        let posts: DevToPost[];
        // Handle different response structures based on search vs regular API
        if (keyword && response.data.result) {
            // Search API response structure
            posts = await Promise.all(response.data.result.map(async (post: any) => {
                const postData: DevToPost = {
                    title: post.title,
                    url: post.path ? `https://dev.to${post.path}` : post.url,
                    author: post.user?.username || 'Unknown',
                    published_at: post.published_at,
                    description: post.description || '',
                    comments_count: post.comments_count || 0,
                    positive_reactions_count: post.public_reactions_count || 0,
                    tags: post.tag_list || [],
                    id: post.id,
                    comments: []
                };
                // Fetch comments if comments_count > 1
                if (postData.comments_count > 1 && post.id) {
                    try {
                        const commentsResponse = await axios.get(`https://dev.to/api/comments?a_id=${post.id}`, {
                            headers: {
                                Accept: 'application/json',
                                'User-Agent': 'DevToFetcher/1.0',
                            },
                        });
                        postData.comments = organizeComments(commentsResponse.data);
                    } catch (error) {
                        console.error(`Error fetching comments for post ${post.id}:`, error);
                    }
                }
                return postData;
            }));
        } else {
            // Regular API response structure
            posts = await Promise.all(response.data.map(async (post: any) => {
                const postData: DevToPost = {
                    title: post.title,
                    url: post.url,
                    author: post.user?.username || 'Unknown',
                    published_at: post.published_at,
                    description: post.description || '',
                    comments_count: post.comments_count || 0,
                    positive_reactions_count: post.positive_reactions_count || 0,
                    tags: post.tag_list || [],
                    id: post.id,
                    comments: []
                };
                // Fetch comments if comments_count > 1
                if (postData.comments_count > 1 && post.id) {
                    try {
                        const commentsResponse = await axios.get(`https://dev.to/api/comments?a_id=${post.id}`, {
                            headers: {
                                Accept: 'application/json',
                                'User-Agent': 'DevToFetcher/1.0',
                            },
                        });
                        postData.comments = organizeComments(commentsResponse.data);
                    } catch (error) {
                        console.error(`Error fetching comments for post ${post.id}:`, error);
                    }
                }
                return postData;
            }));
        }

        // Additional client-side filtering if needed
        if (keyword && !response.data.result) {
            const searchKeyword = keyword.toLowerCase();
            posts = posts.filter(post =>
                post.title.toLowerCase().includes(searchKeyword) ||
                (post.description && post.description.toLowerCase().includes(searchKeyword)) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchKeyword))
            );
        }

        return posts;
    } catch (error) {
        console.error('Error fetching Dev.to posts:', error);
        throw new Error('Failed to fetch Dev.to posts');
    }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get('keyword');
        const tag = searchParams.get('tag');
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 10;

        // Validate limit
        if (isNaN(limit) || limit < 1 || limit > 100) {
            return NextResponse.json(
                { error: 'Invalid limit parameter. Must be a number between 1 and 100.' },
                { status: 400 }
            );
        }

        const posts = await fetchDevToPosts(keyword, tag, limit);
        
        return NextResponse.json({
            success: true,
            data: posts,
            count: posts.length
        });
    } catch (error) {
        console.error('Error in Dev.to API route:', error);
        return NextResponse.json(
            { 
                error: 'Failed to fetch Dev.to posts',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
