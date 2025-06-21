import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import sendPrompt from '@/utils/gemini/connect_gemini';

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

// Function to transform the API response into organized structure
function transformKeywordData(
  apiResponse: any,
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

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   try {
//     const body = await req.json();
//     const search_question: string = body.search_question;
//     const search_country: string = body.search_country;

//     if (!search_question) {
//       return NextResponse.json({ error: 'search_question is required' }, { status: 400 });
//     }

//     const apiKey = process.env.KEYWORD_SEARCH_API;
//     if (!apiKey) {
//       console.error('Missing KEYWORD_SEARCH_API in environment variables');
//       return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
//     }

//     const url = 'https://keywordresearch.api.kwrds.ai/keywords-with-volumes';
//     const data = {
//       search_question: search_question,
//       search_country: search_country || 'en-US',
//     };

//     const response = await axios.post(url, data, {
//       headers: {
//         'X-API-KEY': apiKey,
//         'Content-Type': 'application/json',
//       },
//     });

//     // Transform the response data into organized structure
//     const organizedData = transformKeywordData(response.data, search_question, search_country || 'en-US');
//     return NextResponse.json(organizedData, { status: 200 });
//   } catch (error: any) {
//     console.error('Error fetching keyword suggestions:', error);
//     if (error.response) {
//       return NextResponse.json(
//         {
//           error: 'Keyword API error',
//           details: error.response.data,
//         },
//         { status: error.response.status }
//       );
//     }
//     return NextResponse.json({ error: 'Failed to fetch keyword suggestions' }, { status: 500 });
//   }
// }

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
        } catch (apiError: any) {
            console.error('API request failed:', apiError);
            if (apiError.response) {
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

        const organizedData = transformKeywordData(response.data, search_question, search_country);
        return NextResponse.json(organizedData, { status: 200 });
    } catch (error: any) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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