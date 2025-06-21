import { NextRequest, NextResponse } from "next/server";
import {
  fetchKeywordData,
  validateKeywordParams,
} from "../../../utils/keywords/keywordGenerator";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { keyword, country } = body;

    // Validate the keyword parameter
    const validation = validateKeywordParams(keyword);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errorMessage },
        { status: 400 }
      );
    }

    // Fetch keyword data using the utility function
    const organizedData = await fetchKeywordData(keyword, country || "en-US");
    return NextResponse.json(organizedData, { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handles GET requests for keyword suggestions
export async function handleKeywordGetRequest(
  keyword: string,
  country = "en-US"
): Promise<NextResponse> {
  try {
    // Validate the keyword parameter
    const validation = validateKeywordParams(keyword);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errorMessage },
        { status: 400 }
      );
    }

    // Fetch keyword data using the utility function
    const organizedData = await fetchKeywordData(keyword, country);
    return NextResponse.json(organizedData, { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET handler for Next.js API route
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");
    const country = searchParams.get("country") || "en-US";

    if (!keyword) {
      return NextResponse.json(
        { error: "keyword parameter is required" },
        { status: 400 }
      );
    }

    return await handleKeywordGetRequest(keyword, country);
  } catch (error) {
    console.error("Error in keyword generator API route:", error);
    return NextResponse.json(
      {
        error: "Failed to generate keywords",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
