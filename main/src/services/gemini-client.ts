import { GenerativeModel } from "@google/generative-ai";
import { Problem } from "../app/api/scrap-problem/cheerio-types";

/**
 * GeminiClient class for interacting with the Google Generative AI API
 */
export default class GeminiClient {
  private apiKey: string;
  private model: GenerativeModel | null = null;

  /**
   * Create a new GeminiClient
   * @param apiKey The API key for Gemini
   * @throws Error if the API key is not provided
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set. Please set it in your environment variables."
      );
    }
    this.apiKey = apiKey;
  }

  /**
   * Initialize the Gemini client
   */
  async init() {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      return this;
    } catch (error) {
      console.error("Error initializing Gemini client:", error);
      throw new Error("Failed to initialize Gemini client");
    }
  }

  /**
   * Extract problems from HTML content using Gemini AI
   * @param source The source name (e.g., 'stackoverflow', 'reddit')
   * @param html The HTML content to analyze
   * @param existingData Set of existing problem titles to avoid duplicates
   * @param baseUrl The base URL for resolving relative links
   * @returns Array of problems extracted from the content
   */  async extractProblems(
    source: string,
    html: string,
    existingData: Set<string>,
    baseUrl: string
  ): Promise<Problem[]> {
    if (!this.model) {
      await this.init();
    }

    if (!this.model) {
      throw new Error("Failed to initialize Gemini model");
    }

    const prompt = this.buildExtractPrompt(source, html, existingData);
    const result = await this.model.generateContent(prompt);
    const response = result.response;
    let generatedText = response.text();

    // Process the response
    try {
      generatedText = generatedText.replace("```json", "");
      generatedText = generatedText.replace("```", "");
      // Try to parse the generated text as JSON
      const parsed = JSON.parse(generatedText);

      if (Array.isArray(parsed)) {
        const problems: Problem[] = [];
        problems.push(...parsed);
        console.log(`Extracted ${problems.length} problems from Gemini response`);
        
        if (problems.length === 0) {
          throw new Error("No problems found in Gemini response");
        }

        if (problems.length > 10) {
          console.warn(
            `More than 10 problems found (${problems.length}). Truncating to 10.`
          );
          problems.splice(10);
        }

        // Validate and process the problems
        return this.validateProblems(problems, baseUrl);
      } else {
        throw new Error("Gemini output is not a JSON array");
      }
    } catch (err) {
      console.error("Failed to parse Gemini output as JSON:", err);
      throw new Error("Failed to parse Gemini output as JSON");
    }
  }

  /**
   * Build the prompt for extracting problems from HTML content
   */
  private buildExtractPrompt(
    source: string,
    html: string,
    existingData: Set<string>
  ): string {
    return `You are an AI agent that extracts meaningful, real-world problems or questions shared by users on web pages. Your goal is to help teams discover actionable challenges that can be solved with technology. Given the following HTML content from the "${source}" website, identify and return up to **10 unique, appropriate** problems or questions discussed by users. For each item, extract the following fields: 
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
    )} HTML content:\n\n${html}`;
  }

  /**
   * Validate and process the problems extracted from Gemini
   */
  private validateProblems(problems: Problem[], baseUrl: string): Problem[] {
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
        continue;
      }

      // Ensure URL is absolute
      if (!problem.url.startsWith("http")) {
        problem.url = new URL(problem.url, baseUrl).href;
      }

      // Ensure tags are unique
      problem.tags = Array.from(new Set(problem.tags));

      newProblems.push(problem);
    }

    console.log(
      `Validated ${newProblems.length} problems from Gemini response`
    );

    return newProblems;
  }
}
