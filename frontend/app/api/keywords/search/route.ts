import { NextResponse } from 'next/server';
import { transformKeywordData } from '../../../../utils/keywords/keywordGenerator';
import sendPrompt from '../../../../utils/gemini/connect_gemini';

/**
 * API endpoint for keyword research
 * This endpoint uses Gemini AI to generate keyword suggestions and data
 */
export async function POST(req: Request) {
  try {
    const { keyword, country = 'en-US', limit = 50 } = await req.json();
    
    if (!keyword) {
      return NextResponse.json({ 
        error: 'Keyword parameter is required' 
      }, { status: 400 });
    }
    
    // Create prompt for Gemini
    const prompt = `
      Generate keyword research data for the topic: "${keyword}".
      Create exactly ${limit} related keywords in the ${country} market.
      
      Format the response as JSON with this exact structure (do not include backticks, markdown or any explanations):
      {
        "keyword": {}, // Object with numeric keys (0-${limit-1})
        "volume": {}, // Estimated monthly search volume for each keyword (numbers)
        "cpc": {}, // Estimated cost-per-click in USD (numbers with decimals)
        "avg_monthly_searches": {}, // Array of 12 monthly search volumes for each keyword
        "searchIntent": {}, // Commercial, Informational, Navigational, or Transactional
        "competition_value": {}, // "HIGH", "MEDIUM", or "LOW"
        "Source": {} // Source of data, use "Gemini AI Estimate"
      }
      
      For each numeric key (0-${limit-1}), provide values for all properties.
      Make the data realistic but varied, with volumes between 10 and 100,000.
      
      IMPORTANT: Return ONLY the JSON object with the specified structure and no additional text.
    `;
    
    // Call Gemini API
    const geminiResponse = await sendPrompt(prompt);
    
    // Parse the JSON response from Gemini
    let geminiData;
    try {
      // Extract the JSON part if Gemini surrounds it with backticks or other text
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : geminiResponse;
      geminiData = JSON.parse(jsonString);
      
      // Basic validation of the response structure
      if (!geminiData || !geminiData.keyword || typeof geminiData.keyword !== 'object') {
        throw new Error('Invalid data structure returned by AI');
      }
      
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return NextResponse.json({ 
        error: 'Failed to parse AI-generated keyword data',
        details: parseError.message 
      }, { status: 500 });
    }
    
    // Transform the data using our utility function
    const transformedData = transformKeywordData(geminiData, keyword, country);
    
    return NextResponse.json(transformedData);
  } catch (error: any) {
    console.error('Gemini API request failed:', error);
    
    const errorMessage = error.message || 'Unknown error';
    
    return NextResponse.json({ 
      error: `Failed to generate keyword suggestions: ${errorMessage}` 
    }, { status: 500 });
  }
}
