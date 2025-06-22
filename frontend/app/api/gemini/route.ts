import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * API Route to securely send prompts to the Gemini API
 * This keeps the API key on the server side and not exposed to the client
 */
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ 
        error: 'Prompt is required' 
      }, { status: 400 });
    }

    // Get API key from server environment
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        error: '❌ Gemini API key is not configured on the server' 
      }, { status: 500 });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro', // Use the appropriate model
    });

    // Send prompt to Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return the response
    return NextResponse.json({ 
      result: text 
    });

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    
    return NextResponse.json({ 
      error: `Error communicating with Gemini API: ${error.message}` 
    }, { status: 500 });
  }
}
