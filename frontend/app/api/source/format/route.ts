import { NextResponse } from 'next/server';
import sendPrompt from '../../../../utils/gemini/connect_gemini';

/**
 * API endpoint for processing source data before saving
 * This endpoint uses Gemini AI to clean and format source data
 */
export async function POST(req: Request) {
  try {
    const { data, source, keyword } = await req.json();
    
    if (!data || !source || !keyword) {
      return NextResponse.json({ 
        error: 'Required parameters missing: data, source, keyword' 
      }, { status: 400 });
    }
    
    // Create prompt for Gemini to format the data correctly
    const prompt = `
      I have source data from ${source} about "${keyword}" that needs to be formatted properly.
      Please convert the data into a valid JSON array following this exact structure:
      [
        {
          "body": "The main content of the post as plain text",
          "comments": ["Comment 1 as plain text", "Comment 2 as plain text"],
          "likes": 123,
          "postUrl": "https://example.com/post/123"
        }
      ]
      
      Here's the raw data that needs formatting:
      ${JSON.stringify(data)}
      
      Important formatting rules:
      1. Each item must have body, comments, likes, and postUrl properties
      2. "comments" must be an array of simple strings, not objects or any other format
      3. "likes" must be a number
      4. "body" and "postUrl" must be strings
      5. Don't include HTML tags or special formatting in the strings
      6. Return ONLY a valid JSON array, no additional text or explanation
      7. If any data is missing, use empty strings or 0 values, but include all required fields
    `;
    
    // Call Gemini API
    const geminiResponse = await sendPrompt(prompt);
    
    // Parse the JSON response from Gemini
    let formattedData;
    try {
      // Extract the JSON part if Gemini surrounds it with backticks or other text
      const jsonMatch = geminiResponse.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : geminiResponse;
      formattedData = JSON.parse(jsonString);
      
      // Additional validation to ensure proper structure
      formattedData = formattedData.map(item => ({
        body: String(item.body || ""),
        comments: Array.isArray(item.comments) 
          ? item.comments.map(comment => String(comment))
          : [],
        likes: Number(item.likes || 0),
        postUrl: String(item.postUrl || "")
      }));
      
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return NextResponse.json({ 
        error: 'Failed to format source data' 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data: formattedData,
      source,
      keyword
    });
    
  } catch (error: any) {
    console.error('Source data formatting failed:', error);
    
    const errorMessage = error.message || 'Unknown error';
    
    return NextResponse.json({ 
      error: `Failed to format source data: ${errorMessage}` 
    }, { status: 500 });
  }
}
