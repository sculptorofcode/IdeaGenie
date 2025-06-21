import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface KeywordData {
  keyword: string;
  volume: number;
  cpc: number;
  competition_value: string;
  search_intent: string;
  source: string;
  avg_monthly_searches: number[];
}

interface TransformedKeywordData {
  total_keywords: number;
  search_question: string;
  search_country: string;
  keywords: KeywordData[];
}

// Define the structure of the API response
interface KeywordAPIResponse {
  keyword?: Record<string, string>;
  volume?: Record<string, number>;
  cpc?: Record<string, number>;
  avg_monthly_searches?: Record<string, number[]>;
  searchIntent?: Record<string, string>;
  competition_value?: Record<string, string>;
  Source?: Record<string, string>;
}

// Function to transform the API response into organized structure
function transformKeywordData(
  apiResponse: KeywordAPIResponse,
  searchQuestion: string,
  searchCountry: string
): TransformedKeywordData {
  const {
    keyword,
    volume,
    cpc,
    avg_monthly_searches,
    searchIntent,
    competition_value,
    Source,
  } = apiResponse || {};

  if (!keyword || typeof keyword !== 'object') {
    return {
      total_keywords: 0,
      search_question: searchQuestion,
      search_country: searchCountry,
      keywords: [],
    };
  }

  const keywords: KeywordData[] = [];
  const keywordIndices = Object.keys(keyword);

  keywordIndices.forEach((index) => {
    const keywordData: KeywordData = {
      keyword: keyword[index] || '',
      volume: volume?.[index] || 0,
      cpc: cpc?.[index] || 0,
      competition_value: competition_value?.[index] || 'UNKNOWN',
      search_intent: searchIntent?.[index] || 'Unknown',
      source: Source?.[index] || 'Google',
      avg_monthly_searches: avg_monthly_searches?.[index] || [],
    };
    keywords.push(keywordData);
  });

  // Sort by volume (highest first)
  keywords.sort((a, b) => b.volume - a.volume);

  return {
    total_keywords: keywords.length,
    search_question: searchQuestion,
    search_country: searchCountry,
    keywords: keywords,
  };
}

// Handles GET requests for keyword suggestions
export async function handleKeywordGetRequest(keyword: string, country = 'en-US'): Promise<NextResponse> {
    try {
        const search_question = keyword;
        const search_country = country;

        if (!search_question) {
            return NextResponse.json({ error: 'search_question parameter is required' }, { status: 400 });
        }

        const apiKey = process.env.KEYWORD_SEARCH_API;
        if (!apiKey) {
            console.error('Missing KEYWORD_SEARCH_API in environment variables');
            return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
        }

        const apiUrl = 'https://keywordresearch.api.kwrds.ai/keywords-with-volumes';
        const data = {
            search_question,
            search_country,
            limit: 50,
        };

        let response;
        try {
            response = await axios.post(apiUrl, data, {
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json',
                },
            });
        } catch (apiError: unknown) {
            console.error('API request failed:', apiError);
            if (axios.isAxiosError(apiError) && apiError.response) {
                return NextResponse.json(
                    {
                        error: 'Keyword API error',
                        details: apiError.response.data,
                    },
                    { status: apiError.response.status }
                );
            }
            return NextResponse.json({ error: 'Failed to fetch keyword suggestions' }, { status: 500 });
        }

        const organizedData = transformKeywordData(response.data as KeywordAPIResponse, search_question, search_country);
        return NextResponse.json(organizedData, { status: 200 });
    } catch (error: unknown) {
        console.error('Unexpected error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// GET handler for Next.js API route
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get('keyword');
        const country = searchParams.get('country') || 'en-US';

        if (!keyword) {
            return NextResponse.json(
                { error: 'keyword parameter is required' },
                { status: 400 }
            );
        }

        return await handleKeywordGetRequest(keyword, country);
    } catch (error) {
        console.error('Error in keyword generator API route:', error);
        return NextResponse.json(
            { 
                error: 'Failed to generate keywords',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Exported POST handler for Next.js API route
export default handleKeywordGetRequest;