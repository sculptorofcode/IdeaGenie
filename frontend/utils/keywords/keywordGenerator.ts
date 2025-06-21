import axios from 'axios';

export interface KeywordData {
  keyword: string;
  volume: number;
  cpc: number;
  competition_value: string;
  search_intent: string;
  source: string;
  avg_monthly_searches: number[];
}

export interface TransformedKeywordData {
  total_keywords: number;
  search_question: string;
  search_country: string;
  keywords: KeywordData[];
}

/**
 * Transforms the raw keyword API response into an organized data structure
 * @param apiResponse - The raw response from the keyword API
 * @param searchQuestion - The original search query
 * @param searchCountry - The country code for the search
 * @returns A structured object with organized keyword data
 */
export function transformKeywordData(
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

/**
 * Fetches keyword data from the keyword research API
 * @param keyword - The main keyword to search for
 * @param country - The country code for regional data (defaults to en-US)
 * @param limit - Maximum number of keywords to retrieve (defaults to 50)
 * @returns The keyword data response
 */
export async function fetchKeywordData(
  keyword: string, 
  country: string = 'en-US',
  limit: number = 50
): Promise<TransformedKeywordData> {
  if (!keyword) {
    throw new Error('Keyword parameter is required');
  }

  const apiKey = process.env.KEYWORD_SEARCH_API;
  if (!apiKey) {
    throw new Error('Missing KEYWORD_SEARCH_API in environment variables');
  }

  const apiUrl = 'https://keywordresearch.api.kwrds.ai/keywords-with-volumes';
  const data = {
    search_question: keyword,
    search_country: country,
    limit,
  };

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    return transformKeywordData(response.data, keyword, country);
  } catch (error: any) {
    console.error('API request failed:', error);
    
    if (error.response) {
      throw new Error(`Keyword API error: ${JSON.stringify(error.response.data)}`);
    }
    
    throw new Error('Failed to fetch keyword suggestions');
  }
}

/**
 * Validates the input parameters for keyword research
 * @param keyword - The keyword to validate
 * @returns An object indicating validity and any error message
 */
export function validateKeywordParams(keyword?: string | null): { 
  isValid: boolean; 
  errorMessage: string | null;
} {
  if (!keyword) {
    return {
      isValid: false,
      errorMessage: 'keyword parameter is required'
    };
  }
  
  return {
    isValid: true,
    errorMessage: null
  };
}
