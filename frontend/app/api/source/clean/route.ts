import { NextResponse } from 'next/server';
import { processSourceData } from '../../../../utils/sources/sourceDataFormatter';

/**
 * API endpoint for cleaning and formatting source data
 * This endpoint handles data from different sources and formats it according to the SourceData schema
 */
export async function POST(req: Request) {
  try {
    const { source, data, keyword } = await req.json();
    
    if (!source || !data || !keyword) {
      return NextResponse.json({ 
        error: 'Required fields missing: source, data, keyword' 
      }, { status: 400 });
    }
    
    if (!Array.isArray(data)) {
      return NextResponse.json({ 
        error: 'Data must be an array' 
      }, { status: 400 });
    }
    
    // Process the data according to source type
    const processedData = await processSourceData(source, data);
    
    return NextResponse.json({
      success: true,
      source,
      keyword,
      data: processedData
    });
    
  } catch (error: any) {
    console.error('Failed to clean source data:', error);
    
    return NextResponse.json({ 
      error: `Failed to clean source data: ${error.message}` 
    }, { status: 500 });
  }
}
