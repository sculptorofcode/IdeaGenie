import axios from "axios";

// Types
export interface DevToUser {
  username?: string;
}

export interface DevToComment {
  id_code: string;
  body_html?: string;
  body_markdown?: string;
  user?: DevToUser;
  created_at: string;
  positive_reactions_count?: number;
  parent?: { id_code: string };
}

export interface NestedComment {
  id: string;
  body: string;
  author: string;
  created_at: string;
  positive_reactions_count: number;
  children: NestedComment[];
}

export interface DevToPost {
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

/**
 * Organizes comments into a nested parent-child structure
 * @param comments - The flat array of comments to organize
 * @returns An array of comments with nested children
 */
export function organizeComments(comments: DevToComment[]): NestedComment[] {
  const commentMap = new Map<string, NestedComment>();
  const rootComments: NestedComment[] = [];

  // First pass: create comment objects and map them by ID
  comments.forEach((comment) => {
    const commentObj: NestedComment = {
      id: comment.id_code,
      body: comment.body_html || comment.body_markdown || "",
      author: comment.user?.username || "Unknown",
      created_at: comment.created_at,
      positive_reactions_count: comment.positive_reactions_count || 0,
      children: [],
    };
    commentMap.set(comment.id_code, commentObj);
  });

  // Second pass: organize into parent-child relationships
  comments.forEach((comment) => {
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

/**
 * Fetches posts from Dev.to based on keyword or tag
 * @param keyword - The keyword to search for
 * @param tag - The tag to filter by
 * @param limit - Maximum number of posts to retrieve
 * @returns An array of Dev.to posts
 */
export async function fetchDevToPosts(
  keyword: string | null,
  tag: string | null,
  limit: number = 10
): Promise<DevToPost[]> {
  try {
    let response;
    // If keyword is provided, use Dev.to search API
    if (keyword) {
      const searchUrl = `https://dev.to/search/feed_content?per_page=${limit}&page=0&search_fields=title&approved=&class_name=Article&sort_by=hotness_score&sort_direction=desc&tag_names%5B%5D=&tag_boolean_mode=all&user_id=&published_at%5Bgte%5D=&published_at%5Blte%5D=&q=${encodeURIComponent(
        keyword
      )}`;
      response = await axios.get(searchUrl, {
        headers: {
          Accept: "application/json",
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
          Accept: "application/json",
        },
      });
    }

    let posts: DevToPost[];
    // Handle different response structures based on search vs regular API
    if (keyword && response.data.result) {
      // Search API response structure
      posts = await Promise.all(
        response.data.result.map(async (post: any) => {
          const postData: DevToPost = {
            title: post.title,
            url: post.path ? `https://dev.to${post.path}` : post.url,
            author: post.user?.username || "Unknown",
            published_at: post.published_at,
            description: post.description || "",
            comments_count: post.comments_count || 0,
            positive_reactions_count: post.public_reactions_count || 0,
            tags: post.tag_list || [],
            id: post.id,
            comments: [],
          };
          // Fetch comments if comments_count > 1
          if (postData.comments_count > 1 && post.id) {
            try {
              const commentsResponse = await axios.get(
                `https://dev.to/api/comments?a_id=${post.id}`,
                {
                  headers: {
                    Accept: "application/json",
                  },
                }
              );
              postData.comments = organizeComments(commentsResponse.data);
            } catch (error) {
              console.error(
                `Error fetching comments for post ${post.id}:`,
                error
              );
            }
          }
          return postData;
        })
      );
    } else {
      // Regular API response structure
      posts = await Promise.all(
        response.data.map(async (post: any) => {
          const postData: DevToPost = {
            title: post.title,
            url: post.url,
            author: post.user?.username || "Unknown",
            published_at: post.published_at,
            description: post.description || "",
            comments_count: post.comments_count || 0,
            positive_reactions_count: post.positive_reactions_count || 0,
            tags: post.tag_list || [],
            id: post.id,
            comments: [],
          };
          // Fetch comments if comments_count > 1
          if (postData.comments_count > 1 && post.id) {
            try {
              const commentsResponse = await axios.get(
                `https://dev.to/api/comments?a_id=${post.id}`,
                {
                  headers: {
                    Accept: "application/json",
                  },
                }
              );
              postData.comments = organizeComments(commentsResponse.data);
            } catch (error) {
              console.error(
                `Error fetching comments for post ${post.id}:`,
                error
              );
            }
          }
          return postData;
        })
      );
    }

    // Additional client-side filtering if needed
    if (keyword && !response.data.result) {
      const searchKeyword = keyword.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchKeyword) ||
          (post.description &&
            post.description.toLowerCase().includes(searchKeyword)) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchKeyword))
      );
    }

    return posts;
  } catch (error) {
    console.error("Error fetching Dev.to posts:", error);
    throw new Error("Failed to fetch Dev.to posts");
  }
}

/**
 * Search for Dev.to posts directly without going through API routes
 * This is used as a replacement for the API route
 * @param keyword Search keyword
 * @returns Array of Dev.to posts
 */
export async function searchDevToPosts(keyword: string): Promise<DevToPost[]> {
  return await fetchDevToPosts(keyword, null, 10);
}

/**
 * Validates parameters for Dev.to API requests
 * @param keyword - The keyword parameter to validate
 * @param tag - The tag parameter to validate
 * @returns An object indicating validity and any error message
 */
export function validateDevToParams(
  keyword?: string | null,
  tag?: string | null
): {
  isValid: boolean;
  errorMessage: string | null;
} {
  if (!keyword && !tag) {
    return {
      isValid: false,
      errorMessage: "Either keyword or tag parameter is required",
    };
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}
