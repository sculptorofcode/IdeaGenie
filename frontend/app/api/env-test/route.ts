import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.KEYWORD_SEARCH_API;
  
  return NextResponse.json({
    apiKeyExists: !!apiKey, // Boolean indicating if it exists
    apiKeyLength: apiKey ? apiKey.length : 0 // Length of the key for verification
  });
}
