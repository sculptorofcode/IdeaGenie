import { NextRequest, NextResponse } from 'next/server';
import { handleKeywordGetRequest } from '../keyword_generator_api/keyword_generator_api';
import { fetchDevToPosts } from '../../../utils/sources/devtoService';
import sendPrompt from '../../../utils/gemini/connect_gemini';
import mongoose from 'mongoose';
import { IKeywordExploration } from '../../../models/KeywordExploration';
import { ISourceData } from '../../../models/SourceData';
import { ILLMInsight } from '../../../models/LLMInsight';

// Dynamic import to avoid TypeScript model errors with mongoose
const KeywordExploration = mongoose.models.KeywordExploration || mongoose.model('KeywordExploration');
const SourceData = mongoose.models.SourceData || mongoose.model('SourceData');
const LLMInsight = mongoose.models.LLMInsight || mongoose.model('LLMInsight');

// Pipeline interface
interface KeywordPipelineOptions {
  userId: string;
  mainKeyword: string;
  country?: string;
}

/**
 * Main pipeline function that orchestrates the entire keyword processing flow
 */
export async function runKeywordPipeline({ userId, mainKeyword, country = 'en-US' }: KeywordPipelineOptions): Promise<any> {
  try {
    console.log(`Starting pipeline for keyword: ${mainKeyword} and user: ${userId}`);
    
    // Step 1: Create keyword exploration record in the database
    const exploration = await createExplorationRecord(userId, mainKeyword, country);
    
    // Step 2: Generate subkeywords
    const subkeywords = await generateSubkeywords(mainKeyword, country);
    
    // Step 3: Update the exploration with subkeywords
    await updateExplorationWithSubkeywords(exploration._id, subkeywords);
    
    // Step 4: Choose top 5 subkeywords by search volume and CPC
    const topKeywords = selectTopSubkeywords(subkeywords, 5);
    
    // Step 5: Search posts based on keywords
    const sourcePosts = await fetchSourcePosts(topKeywords, exploration._id);
    
    // Step 6: Process with Gemini
    const geminiResult = await processWithGemini(exploration._id, topKeywords, sourcePosts);
    
    // Step 7: Save LLM insights to database
    const llmInsight = await saveLLMInsights(exploration._id, geminiResult);
    
    // Step 8: Mark exploration as complete
    await markExplorationComplete(exploration._id);
    
    return {
      success: true,
      explorationId: exploration._id,
      insightId: llmInsight._id,
      message: "Pipeline completed successfully"
    };
  } catch (error) {
    console.error("Pipeline execution failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "Pipeline execution failed"
    };
  }
}

/**
 * Creates a new keyword exploration record in the database
 */
async function createExplorationRecord(userId: string, mainKeyword: string, country: string) {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }
    
    const exploration = await KeywordExploration.create({
      userId: new mongoose.Types.ObjectId(userId),
      mainKeyword,
      country,
      sourcesScraped: [],
      completed: false
    });
    
    return exploration;
  } catch (error) {
    console.error("Failed to create exploration record:", error);
    throw error;
  }
}

/**
 * Generates subkeywords for the main keyword using the keyword generator API
 */
async function generateSubkeywords(mainKeyword: string, country: string) {
  try {
    const response = await handleKeywordGetRequest(mainKeyword, country);
    const responseData = await response.json();
    
    if (!responseData.keywords || responseData.keywords.length === 0) {
      throw new Error("No keywords returned from API");
    }
    
    return responseData.keywords.map((kw: any) => ({
      keyword: kw.keyword,
      volume: kw.volume,
      cpc: kw.cpc,
      intent: kw.search_intent,
      competition: kw.competition_value,
      trend: kw.avg_monthly_searches ? 
        kw.avg_monthly_searches.map((searches: number, index: number) => {
          const date = new Date();
          // Create trend data for past 12 months
          date.setMonth(date.getMonth() - (11 - index));
          return {
            month: date.toLocaleString('default', { month: 'short' }),
            year: date.getFullYear(),
            searches
          };
        }) : []
    }));
  } catch (error) {
    console.error("Failed to generate subkeywords:", error);
    throw error;
  }
}

/**
 * Updates the exploration record with generated subkeywords
 */
async function updateExplorationWithSubkeywords(explorationId: mongoose.Types.ObjectId, subkeywords: any[]) {
  try {
    await KeywordExploration.findByIdAndUpdate(explorationId, {
      subkeywords
    });
  } catch (error) {
    console.error("Failed to update exploration with subkeywords:", error);
    throw error;
  }
}

/**
 * Selects top subkeywords based on a scoring formula that considers both search volume and CPC
 */
function selectTopSubkeywords(subkeywords: any[], count: number) {
  // Score each keyword by volume * cpc
  const scoredKeywords = subkeywords.map(kw => ({
    ...kw,
    score: kw.volume * kw.cpc // Simple scoring formula
  }));
  
  // Sort by score (highest first)
  scoredKeywords.sort((a, b) => b.score - a.score);
  
  // Return top N keywords
  return scoredKeywords.slice(0, count);
}

/**
 * Fetches posts from various sources for the given keywords
 */
async function fetchSourcePosts(keywords: any[], explorationId: mongoose.Types.ObjectId) {
  try {
    const allPosts: any[] = [];
    
    // For each top keyword
    for (const keyword of keywords) {
      const keywordStr = keyword.keyword;
      console.log(`Fetching posts for keyword: ${keywordStr}`);
      
      // Fetch posts from Dev.to (you can add more sources in the future)
      const devToResponse = await fetchDevToPosts(keywordStr, null, 30);
      
      const formattedPosts = devToResponse.map((post: any) => ({
        body: post.description || post.title,
        comments: post.comments && post.comments.length > 0 
          ? post.comments.map((comment: any) => comment.body || '') 
          : [],
        likes: post.positive_reactions_count || 0,
        postUrl: post.url
      }));
      
      // Save to database
      const sourceData = await SourceData.create({
        explorationId,
        source: 'devto',
        keyword: keywordStr,
        data: formattedPosts
      });
      
      // Update scrapedSources in the exploration
      await KeywordExploration.findByIdAndUpdate(explorationId, {
        $addToSet: { sourcesScraped: 'devto' }
      });
      
      allPosts.push({
        keyword: keywordStr,
        posts: formattedPosts
      });
    }
    
    return allPosts;
  } catch (error) {
    console.error("Failed to fetch source posts:", error);
    throw error;
  }
}

/**
 * Processes the gathered data with Gemini AI to generate insights
 */
async function processWithGemini(explorationId: mongoose.Types.ObjectId, topKeywords: any[], sourcePosts: any[]) {
  try {
    // Create the LLM Insight record for tracking
    const llmRecord = await LLMInsight.create({
      explorationId,
      status: 'in_progress',
      model: 'gemini-2.0-flash-exp',
      problems: [],
      productIdeas: []
    });
    
    // Format the data for Gemini
    const keywordData = topKeywords.map(kw => ({
      keyword: kw.keyword,
      volume: kw.volume,
      cpc: kw.cpc,
      competition: kw.competition,
      intent: kw.intent
    }));
    
    // Format post data
    const postSummaries = sourcePosts.flatMap(kw => 
      kw.posts.map((post: any) => ({
        keyword: kw.keyword,
        title: post.body.substring(0, 100), // Use beginning of body as title
        content: post.body,
        engagement: post.likes,
        url: post.postUrl
      }))
    );
    
    // Limit to prevent token overflows
    const limitedPostSummaries = postSummaries.slice(0, 30);
    
    // Construct the prompt for Gemini
    const prompt = `
You're an expert in identifying user problems and creating product ideas based on social media and blog discussions. 
Analyze the following data to extract 3-5 key user problems and suggest 2-3 product ideas to solve them.

KEYWORD DATA:
${JSON.stringify(keywordData)}

SOCIAL DISCUSSIONS AND BLOG POSTS:
${JSON.stringify(limitedPostSummaries)}

OUTPUT FORMAT:
1. Provide a brief analysis of the discussions (2-3 sentences)
2. List 3-5 specific user problems identified (format: Problem: [problem], Context: [where/how it occurs], Pain point: [specific impact], Emotions: [user feelings])
3. Suggest 2-3 product ideas to solve these problems (format: Product: [name], Description: [short description], Features: [3-5 key features])
4. Overall sentiment: [positive/negative/mixed]

Make your analysis practical, detailed, and focused on real-world applications.
`;

    console.log("Sending prompt to Gemini");
    const geminiResponse = await sendPrompt(prompt);
    console.log("Received response from Gemini");
    
    return geminiResponse;
  } catch (error) {
    console.error("Failed to process with Gemini:", error);
    throw error;
  }
}

/**
 * Saves the insights from Gemini to the database
 */
async function saveLLMInsights(explorationId: mongoose.Types.ObjectId, geminiOutput: string) {
  try {
    // Simple extraction of problems and product ideas (this could be more sophisticated)
    const problems = extractProblems(geminiOutput);
    const productIdeas = extractProductIdeas(geminiOutput);
    const sentiment = extractSentiment(geminiOutput);
    
    // Update the existing LLM insight record
    const updatedRecord = await LLMInsight.findOneAndUpdate(
      { explorationId },
      { 
        problems,
        productIdeas,
        sentiment,
        status: 'complete'
      },
      { new: true }
    );
    
    return updatedRecord;
  } catch (error) {
    console.error("Failed to save LLM insights:", error);
    throw error;
  }
}

/**
 * Marks the exploration as complete
 */
async function markExplorationComplete(explorationId: mongoose.Types.ObjectId) {
  try {
    await KeywordExploration.findByIdAndUpdate(explorationId, {
      completed: true
    });
  } catch (error) {
    console.error("Failed to mark exploration as complete:", error);
    throw error;
  }
}

// Helper functions to extract information from Gemini output
function extractProblems(text: string): string[] {
  // This is a simple extraction - in production, you might want more sophisticated parsing
  const problemSection = text.split(/3[.-]\s*product ideas/i)[0];  const problemMatches = problemSection.match(/problem:.*?(?=problem:|$)/gi);
  
  if (!problemMatches) return [];
  return problemMatches.map(p => p.trim());
}

function extractProductIdeas(text: string): string[] {
  // Simple extraction of product ideas
  const productSection = text.match(/product ideas.*?(?=4[.-]|overall sentiment|$)/i)?.[0] || '';
  const productMatches = productSection.match(/product:.*?(?=product:|$)/gi);
  
  if (!productMatches) return [];
  return productMatches.map(p => p.trim());
}

function extractSentiment(text: string): string {
  // Extract sentiment
  const sentimentMatch = text.match(/sentiment:\s*([a-z]+)/i);
  return sentimentMatch ? sentimentMatch[1].toLowerCase() : 'unknown';
}

// API route handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId, keyword, country } = body;
    
    if (!userId || !keyword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters: userId and keyword' 
      }, { status: 400 });
    }
    
    const result = await runKeywordPipeline({
      userId,
      mainKeyword: keyword,
      country: country || 'en-US'
    });
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Pipeline API error:", error);
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
