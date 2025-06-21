import { NextResponse } from 'next/server';

/**
 * This API route generates a prompt for Gemini based on the provided data
 * Since Gemini calls can be made from the client, this just formats the prompt 
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mainKeyword, keywordsList, sourcePosts } = body;
    
    if (!mainKeyword || !sourcePosts) {
      return NextResponse.json({ message: 'Missing required data' }, { status: 400 });
    }
    
    // Extract and format the content from posts
    let postsContent = '';
    sourcePosts.forEach((source: any) => {
      postsContent += `Posts about "${source.keyword}":\n`;
      
      source.posts.forEach((post: any, index: number) => {
        if (index < 3) { // Limit to 3 posts per keyword to keep prompt size manageable
          postsContent += `- Title: ${post.title}\n`;
          postsContent += `  Description: ${post.description || 'No description'}\n`;
          if (post.comments && post.comments.length > 0) {
            postsContent += `  Top comment: ${post.comments[0].body || 'No content'}\n`;
          }
          postsContent += '\n';
        }
      });
    });
    
    // Construct the prompt for Gemini
    const prompt = `
    I'm analyzing the topic "${mainKeyword}" and related keywords (${keywordsList}).
    Here are some posts from Dev.to about these topics:
    
    ${postsContent}
    
    Based on this information, provide the following:
    
    1. PROBLEMS: List 3-5 problems that people face related to "${mainKeyword}" based on the context. Format each as "Problem: {title}, Context: {brief context}, Pain point: {specific pain}, Emotions: [{emotions}]"
    
    2. PRODUCT IDEAS: Suggest 3-5 potential product ideas that could solve these problems. Format each as "Product: {product name}, Description: {what it does}, Problem solved: {which problem}, Target audience: {who would use it}, Key features: {list key features}"
    
    3. SENTIMENT: Analyze the overall sentiment around "${mainKeyword}" (positive, negative, or mixed) and explain why in a few sentences.
    
    Make your responses data-driven and based on the content provided, not speculative. Present each section clearly with numbered items.
    `;
    
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Failed to generate Gemini prompt:', error);
    return NextResponse.json({ 
      message: 'Failed to generate prompt',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
