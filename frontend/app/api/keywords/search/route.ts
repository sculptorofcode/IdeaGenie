import { NextResponse } from 'next/server';
import axios from 'axios';
import { transformKeywordData } from '../../../../utils/keywords/keywordGenerator';

/**
 * API endpoint for keyword research
 * This endpoint acts as a proxy to the keyword research API
 * to avoid exposing API keys in client-side code
 */
export async function POST(req: Request) {
  try {
    const { keyword, country = 'en-US', limit = 50 } = await req.json();
    
    if (!keyword) {
      return NextResponse.json({ 
        error: 'Keyword parameter is required' 
      }, { status: 400 });
    }
    
    const apiKey = process.env.KEYWORD_SEARCH_API;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'Missing KEYWORD_SEARCH_API in environment variables' 
      }, { status: 500 });
    }
    
    const apiUrl = 'https://keywordresearch.api.kwrds.ai/keywords-with-volumes';
    const data = {
      search_question: keyword,
      search_country: country,
      limit
    };
    
    const response = await axios.post(apiUrl, data, {
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });
    
    // Transform the data using our utility function
    const transformedData = transformKeywordData(response.data, keyword, country);
    
    return NextResponse.json(transformedData);
  } catch (error: any) {
    console.error('API request failed:', error);
    
    if (error.response) {
      return NextResponse.json({ 
        error: `Keyword API error: ${JSON.stringify(error.response.data)}` 
      }, { status: error.response.status || 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch keyword suggestions' 
    }, { status: 500 });
  }
}
