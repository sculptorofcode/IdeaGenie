import { NextResponse } from 'next/server';

/**
 * Check if the Gemini API key is properly configured
 * This endpoint checks if the GEMINI_API_KEY environment variable is set
 * and returns appropriate status and information
 */
export async function GET() {
  try {
    // Check if Gemini API key is configured
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        { 
          status: 'error', 
          configured: false,
          message: '❌ Gemini API key is not defined in the .env file',
          instructions: 'Please add GEMINI_API_KEY to your .env file or environment variables'
        },
        { status: 400 }
      );
    }
    
    // If we get here, the API key is configured (but we don't validate if it's correct)
    return NextResponse.json(
      { 
        status: 'success', 
        configured: true,
        message: '✅ Gemini API key is configured'
      }
    );
  } catch (error: any) {
    console.error('Error checking Gemini API key:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        configured: false,
        message: 'Error checking Gemini API key configuration',
        error: error.message || 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

/**
 * Allows checking if the API key works by making a minimal request
 */
export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // First check if the key exists
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        { 
          status: 'error', 
          configured: false,
          message: '❌ Gemini API key is not defined in the .env file',
          instructions: 'Please add GEMINI_API_KEY to your .env file or environment variables'
        },
        { status: 400 }
      );
    }
    
    // Import the Google Generative AI client
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    
    // Initialize the API with the provided key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Make a minimal test request
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent("Hello, are you working? Just respond with 'yes'.");
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({
      status: 'success',
      configured: true,
      working: true,
      message: '✅ Gemini API key is valid and working',
      testResponse: text
    });
    
  } catch (error: any) {
    console.error('Error testing Gemini API key:', error);
    
    // If there's an API key but it failed, it might be invalid
    const apiKey = process.env.GEMINI_API_KEY;
    const message = apiKey 
      ? '❌ Gemini API key is configured but appears to be invalid or has access issues'
      : '❌ Gemini API key is not defined in the .env file';
      
    return NextResponse.json(
      { 
        status: 'error', 
        configured: Boolean(apiKey),
        working: false,
        message,
        error: error.message || 'Unknown error'
      }, 
      { status: 400 }
    );
  }
}
