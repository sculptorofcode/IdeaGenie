import { NextResponse } from "next/server";
import axios from "axios";
import { Problem, SourceConfig } from "./cheerio-types";
import SheetsService from "../../../services/sheets";

// Sources to scrape programming problems from
const sources: Record<string, SourceConfig> = {
  stackoverflow: {
    url: "https://stackoverflow.com/questions/tagged/javascript?tab=newest&pagesize=15",
  },
  reddit: {
    url: "https://www.reddit.com/r/AskReddit/",
  },
  github: {
    url: "https://github.com/topics/programming-challenges",
  },
  devto: {
    url: "https://dev.to/latest",
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
    }
    // Use selectedSource for response and logging
    source = selectedSource;
    const url = sourceConfig.url;

    console.log(`Scraping problems from ${url}`);

    // Fetch the HTML content
    try {
      const response = await axios.get(url, {
        headers: {
          // Use a more modern user agent
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          Referer: "https://www.google.com/",
          "sec-ch-ua":
            '"Microsoft Edge";v="121", "Not A(Brand";v="24", "Chromium";v="121"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "cross-site",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
          Cookie: "", // Some sites require cookies
        },
        timeout: 15000, // Increase timeout
        validateStatus: (status) => status < 500, // Accept 4xx status codes to handle them ourselves
      });

      console.log(
        `Fetched ${response.data.length} characters from ${url} (Status: ${response.status})`
      );

      // Handle 403 Forbidden specifically
      if (response.status === 403) {
        return NextResponse.json(
          {
            success: false,
            error: "Access forbidden by the server",
            message: `Unable to access ${url} - the server is blocking automated requests`,
            alternativeMessage:
              "Consider using a public API instead of web scraping",
            source,
          },
          { status: 403 }
        );
      }

      // Handle other non-200 responses
      if (response.status !== 200) {
        return NextResponse.json(
          {
            success: false,
            error: `Server responded with status ${response.status}`,
            message: `Unable to fetch data from ${url}`,
            source,
          },
          { status: response.status }
        );
      }

      const html = response.data;

      const cleanedHtml = html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "");
      console.log("Cleaned HTML content, length:", cleanedHtml.length);

      // Extract problems
      const problems: Problem[] = [];

      try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const spreadsheetId = process.env.SHEETS_ID;
        const tabName = process.env.SHEETS_TAB || "Problems";

        if (!spreadsheetId) {
          throw new Error("SHEETS_ID is not set in environment variables.");
        }
        // Use our SheetsService with service account authentication
        const sheetsService = new SheetsService(spreadsheetId, tabName);
        await sheetsService.init();

        const sheetRowsCount = await sheetsService.getRowsCount();
        const sheetsData = await sheetsService.readRows(
          `${tabName}!A${
            sheetRowsCount > 500 ? sheetRowsCount - 500 : 2
          }:A${sheetRowsCount}`
        );
        const existingData = new Set(sheetsData.map((row) => row[0]));

        const { GoogleGenerativeAI } = await import("@google/generative-ai");

        if (!GEMINI_API_KEY) {
          throw new Error(
            "GEMINI_API_KEY is not set. Please set it in your environment variables."
          );
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log("existingData length:", existingData.size);

        const prompt = `You are an AI agent that extracts meaningful, real-world problems or questions shared by users on web pages. Your goal is to help teams discover actionable challenges that can be solved with technology. Given the following HTML content from the "${source}" website, identify and return up to **10 unique, appropriate** problems or questions discussed by users. For each item, extract the following fields: 
        - "title" (string): A clear, short summary of the problem/question 
        - "description" (string): A concise description of the issue or context 
        - "emotion" (string): The underlying emotion conveyed (e.g., frustration, curiosity, confusion, urgency) 
        - "url" (string): The original post's or discussion thread's URL 
        - "tags" (string[]): Relevant topics or technologies related to the problem 
        - "source" (string): Name of the source platform (e.g., Reddit, StackOverflow)
        - "rating" (number): A number from 1 (least important) to 5 (most important) indicating how impactful or urgent the problem is
        - "urgency" (number): A number from 1 (not urgent) to 5 (very urgent) indicating how quickly the problem needs to be addressed
        - "popularity" (number): A number from 1 (not popular) to 5 (very popular) indicating how many people are affected by this problem
        - "difficulty" (string): A string indicating the difficulty level of the problem (e.g., "easy", "medium", "hard")
        - "novelty" (number): A number from 1 (common) to 5 (very novel/unique) indicating how original or new the problem is
        - "feasibility" (number): A number from 1 (hard to solve) to 5 (easy to solve) indicating how feasible it is to address the problem with technology
        - "impact_scope" (string): One of "personal", "community", "global" indicating the scale of the problem's impact
        - "category" (string): A category for the problem, such as "web development", "mobile apps", "data science", etc.

        **Important instructions:** 
        - Focus on **real-world problems** that users are currently facing, not just general complaints or vague issues.
        - Extract problems that are **current, solvable**, and could affect anyone, not just developers.
        - Each problem should be unique and not already present in the provided data.
        - Only include problems that are safe, appropriate, and suitable for building tech-based solutions. 
        - Avoid duplicates, general complaints, or vague issues. 
        - Focus on **current, solvable challenges** that could affect anyone, not just developers.
        - Exclude any content that is sexual, vulgar, promotional, or irrelevant. 
        - Try to diversify the problems across different ratings (e.g., some high urgency, some high novelty, some high feasibility, etc.) to ensure a varied set.
        - Return the results as a clean **JSON array of objects** with the specified structure. 
        - Ensure the JSON is valid and properly formatted.
        - Do not include any problems that are already present in the Google Sheets data.
        - The problems should be relevant to the source platform and its audience.
        - Do not include any problem whose title already exists in this list: ${JSON.stringify(
          Array.from(existingData)
        )} HTML content:\n\n${cleanedHtml}`;

        const result = await model.generateContent(prompt);

        const response = result.response;
        let generatedText = response.text();

        try {
          generatedText = generatedText.replace("```json", "");
          generatedText = generatedText.replace("```", "");
          // Try to parse the generated text as JSON
          const parsed = JSON.parse(generatedText);

          if (Array.isArray(parsed)) {
            problems.push(...parsed);
          } else {
            throw new Error("Gemini output is not a JSON array");
          }
        } catch (err) {
          console.error("Failed to parse Gemini output as JSON:", err);
          throw new Error("Failed to parse Gemini output as JSON");
        }

        console.log(
          `Extracted ${problems.length} problems from Gemini response`
        );
        if (problems.length === 0) {
          throw new Error("No problems found in Gemini response");
        }

        if (problems.length > 10) {
          console.warn(
            `More than 10 problems found (${problems.length}). Truncating to 10.`
          );
          problems.splice(10);
        }

        const validateProblem = (problem: Problem): problem is Problem => {
          return (
            typeof problem.title === "string" &&
            typeof problem.description === "string" &&
            typeof problem.emotion === "string" &&
            typeof problem.url === "string" &&
            Array.isArray(problem.tags) &&
            problem.tags.every((tag: string) => typeof tag === "string") &&
            typeof problem.source === "string"
          );
        };

        const newProblems: Problem[] = [];

        // Validate the structure of each problem
        for (const problem of problems) {
          if (!validateProblem(problem)) {
            console.warn("Invalid problem structure:", problem);
            throw new Error("Invalid problem structure");
          }

          // Ensure URL is absolute
          if (!problem.url.startsWith("http")) {
            problem.url = new URL(problem.url, url).href;
          }

          // Ensure tags are unique
          problem.tags = Array.from(new Set(problem.tags));

          newProblems.push(problem);
        }

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
            const formatted = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
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
              problem.impact_scope,
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

      // Enhanced error information
      const errorInfo = {
        success: false,
        error: "Error fetching URL",
        message: (error as Error).message || "Unknown error",
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
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
