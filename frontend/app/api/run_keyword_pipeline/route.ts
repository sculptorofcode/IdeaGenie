import { NextRequest, NextResponse } from 'next/server';
import { executeKeywordPipeline, validatePipelineParams } from '../../../utils/pipeline/keywordPipelineUtils';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId, keyword, country } = body;
    
    // Validate required parameters
    const validation = validatePipelineParams(userId, keyword);
    if (!validation.isValid) {
      return NextResponse.json({ 
        success: false, 
        error: validation.errorMessage 
      }, { status: 400 });
    }
    
    // Execute the pipeline using the utility function
    const result = await executeKeywordPipeline(userId, keyword, country || 'en-US');
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    message: "This endpoint requires a POST request with userId and keyword parameters"
  }, { status: 405 });
}
