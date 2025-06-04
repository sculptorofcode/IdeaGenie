import { NextResponse } from "next/server";
import { SourceConfig } from "./cheerio-types";
import SheetsService from "../../../services/sheets";
import SourceClientFactory from "../../../services/source-client-factory";
import GeminiClient from "../../../services/gemini-client";

// Sources to scrape programming problems from
const sources: Record<string, SourceConfig> = {
  github: {
    url: "https://github.com/topics/programming-challenges",
  },
  devto: {
    url: "https://dev.to/latest",
  },
  stackexchange: {
    url: "https://stackoverflow.com/questions/", // default to stackoverflow, can be changed to any stackexchange site
  },
  reddit: {
    url: "https://www.reddit.com/r/programming/", // default subreddit, can be changed
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let source = searchParams.get("source");
    // If source is not provided or invalid, pick a random source
    let sourceConfig: SourceConfig;
    let selectedSource = source;
    if (!source || !sources[source]) {
      // Pick a random source key
      const sourceKeys = Object.keys(sources);
      selectedSource =
        sourceKeys[Math.floor(Math.random() * sourceKeys.length)];
      sourceConfig = sources[selectedSource];
    } else {
      sourceConfig = sources[source];
    } // Use selectedSource for response and logging
    source = selectedSource;
    const url = sourceConfig.url;

    console.log(`Scraping problems from ${url}`);

    // Fetch the HTML content
    try {
      // Create the appropriate source client using the factory
      // At this point, source is guaranteed to be a string since we set it to selectedSource above
      const sourceClient = SourceClientFactory.createClient(
        source as string,
        sourceConfig
      );

      // For stackexchange, return the JSON output directly for testing
      if (source === 'stackexchange') {
        const jsonOutput = await sourceClient.fetchContent();
        return NextResponse.json({
          success: true,
          source,
          output: JSON.parse(jsonOutput),
        });
      }

      // For reddit, return the JSON output directly for testing
      if (source === 'reddit') {
        const jsonOutput = await sourceClient.fetchContent();
        return NextResponse.json({
          success: true,
          source,
          output: JSON.parse(jsonOutput),
        });
      }

      // Fetch and clean HTML content using the specific source client
      let cleanedHtml: string;
      try {
        cleanedHtml = await sourceClient.fetchContent();
      } catch (error) {
        // Handle client-specific errors
        if (error instanceof Error) {
          if (error.message.includes("Access forbidden")) {
            return NextResponse.json(
              {
                success: false,
                error: "Access forbidden by the server",
                message: error.message,
                alternativeMessage:
                  "Consider using a public API instead of web scraping",
                source,
              },
              { status: 403 }
            );
          } else {
            return NextResponse.json(
              {
                success: false,
                error: `Server error`,
                message: error.message,
                source,
              },
              { status: 500 }
            );
          }
        }
        throw error; // Re-throw if not handled specifically
      }
      try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const spreadsheetId = process.env.SHEETS_ID;
        const tabName = process.env.SHEETS_TAB || "Problems";

        if (!spreadsheetId) {
          throw new Error("SHEETS_ID is not set in environment variables.");
        }

        if (!GEMINI_API_KEY) {
          throw new Error("GEMINI_API_KEY is not set in environment variables.");
        }

        // Use our SheetsService with service account authentication
        const sheetsService = new SheetsService(spreadsheetId, tabName);
        await sheetsService.init();

        const sheetRowsCount = await sheetsService.getRowsCount();
        const sheetsData = await sheetsService.readRows(
          `${tabName}!C${
            sheetRowsCount > 200 ? sheetRowsCount - 200 : 2
          }:C${sheetRowsCount}`
        );
        const existingData = new Set(sheetsData.map((row) => row[0]));

        console.log("existingData length:", existingData.size);

        // Use our GeminiClient to extract problems
        const geminiClient = new GeminiClient(GEMINI_API_KEY);
        
        // Extract problems using the Gemini client
        const newProblems = await geminiClient.extractProblems(
          source as string, 
          cleanedHtml, 
          existingData,
          url
        );

        console.log(
          `Validated ${newProblems.length} problems from Gemini response`
        );

        // If no problems were found, return a warning
        if (newProblems.length === 0) {
          console.warn("No valid problems found in Gemini response");
          return NextResponse.json(
            {
              success: true,
              warning:
                "No valid problems found. The website structure might have changed or the AI did not find any relevant issues.",
              source,
              count: 0,
              problems: [],
            },
            { status: 200 }
          );
        }

        try {
          // Prepare the data to append (one row per problem)
          const rows = newProblems.map((problem) => {
            const now = new Date();
            const formatted = now.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            });
            return [
              formatted,
              problem.title,
              problem.description,
              problem.emotion,
              problem.category || "general",
              problem.tags.join(", "),
              problem.source,
              problem.url,
              problem.rating?.toString() || "1",
              problem.difficulty || "medium",
              problem.urgency?.toString() || "1",
              problem.popularity?.toString() || "1",
              problem.novelty?.toString() || "1",
              problem.feasibility?.toString() || "1",
              problem.impact_scope || "personal",
            ].map((value) => value?.toString() ?? "");
          });
          await sheetsService.appendRows(rows);

          console.log(
            `Appended ${rows.length} problems to Google Sheets using service account`
          );
        } catch (err) {
          console.error("Error storing problems in Google Sheets:", err);
          // Do not throw, just log the error and continue
        }

        // Assign the validated problems back
        return NextResponse.json({
          success: true,
          source,
          count: newProblems.length,
          problems: newProblems,
        });
      } catch (error: unknown) {
        console.error("Error using Gemini API:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Error using Gemini API",
            message:
              (error instanceof Error ? error.message : error) ||
              "Unknown error",
            source,
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error fetching URL:", error);

      // Enhanced error information\n
      const errorInfo = {
        success: false,
        error: "Error fetching URL",
        message: error instanceof Error ? error.message : "Unknown error",
        url: url,
        suggestion:
          "The website may be blocking scraping attempts. Consider using their official API if available.",
      };

      return NextResponse.json(errorInfo, { status: 500 });
    }
  } catch (error) {
    console.error("Error scraping problems:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error scraping problems",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
