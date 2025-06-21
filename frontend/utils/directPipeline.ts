/**
 * This file provides a direct implementation of the keyword pipeline
 * that can be used without going through API routes.
 * It performs all the same functionality as the previous pipeline but
 * without the API layer.
 */

import mongoose from 'mongoose';
import { fetchKeywordData } from './keywords/keywordGenerator';
import { searchDevToPosts } from './sources/devtoService';
import sendPrompt from './gemini/connect_gemini';
import { IKeywordExploration } from '../models/KeywordExploration';
import { ISourceData } from '../models/SourceData';
import { ILLMInsight } from '../models/LLMInsight';

// Safely initialize models to avoid "Cannot read properties of undefined" errors
let KeywordExploration: mongoose.Model<IKeywordExploration & mongoose.Document, {}>;
let SourceData: mongoose.Model<ISourceData & mongoose.Document, {}>;
let LLMInsight: mongoose.Model<ILLMInsight & mongoose.Document, {}>;

// Initialize models safely
function initModels() {
  try {
    // Check if models already exist
    KeywordExploration = mongoose.models.KeywordExploration || mongoose.model('KeywordExploration');
    SourceData = mongoose.models.SourceData || mongoose.model('SourceData');
    LLMInsight = mongoose.models.LLMInsight || mongoose.model('LLMInsight');
  } catch (error) {
    // If models are not registered, import them directly
    console.log("Initializing models from schema files...");
    KeywordExploration = require('../models/KeywordExploration').default;
    SourceData = require('../models/SourceData').default;
    LLMInsight = require('../models/LLMInsight').default;
  }
}

// Pipeline interface
interface KeywordPipelineOptions {
  userId: string;
  mainKeyword: string;
  country?: string;
}

/**
 * Main pipeline function that orchestrates the entire keyword processing flow
 */
export async function runKeywordPipelineDirect({ userId, mainKeyword, country = 'en-US' }: KeywordPipelineOptions) {
  try {
    console.log(`Starting pipeline for keyword: ${mainKeyword} and user: ${userId}`);
    
    // Initialize models first
    initModels();
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }
    
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
      explorationId: String(exploration._id),
      insightId: String(llmInsight._id),
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
    // We need a valid ObjectId for userId
    const exploration = await KeywordExploration.create({
      userId: userId,
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
    // Call the keyword service directly instead of through the API
    const keywordData = await fetchKeywordData(mainKeyword, country);
    
    if (!keywordData.keywords || keywordData.keywords.length === 0) {
      throw new Error("No keywords returned from service");
    }
    
    return keywordData.keywords.map(kw => ({
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
    score: (kw.volume || 0) * (kw.cpc || 0.1) // Ensure we don't multiply by zero
  }));
  
  // Sort by score (highest first) and take the top 'count'
  return scoredKeywords
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

/**
 * Fetches posts from Dev.to based on the selected keywords
 */
async function fetchSourcePosts(keywords: any[], explorationId: mongoose.Types.ObjectId) {
  try {
    const sourcePosts = [];
    
    // Process each keyword in parallel using Promise.all
    const promises = keywords.map(async keyword => {
      try {
        // Call the devToService directly instead of through the API
        const posts = await searchDevToPosts(keyword.keyword);
        
        // Save source data to database
        await SourceData.create({
          explorationId,
          keyword: keyword.keyword,
          source: 'dev.to',
          data: posts
        });
        
        return {
          keyword: keyword.keyword,
          posts
        };
      } catch (error) {
        console.error(`Failed to fetch posts for keyword ${keyword.keyword}:`, error);
        return {
          keyword: keyword.keyword,
          posts: []
        };
      }
    });
    
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Failed to fetch source posts:", error);
    throw error;
  }
}

/**
 * Processes the collected data with Gemini AI
 */
async function processWithGemini(explorationId: mongoose.Types.ObjectId, keywords: any[], sourcePosts: any[]) {
  try {
    // Get the exploration record for context
    const exploration = await KeywordExploration.findById(explorationId);
    if (!exploration) {
      throw new Error("Exploration not found");
    }
    
    // Prepare data for Gemini
    const mainKeyword = exploration.mainKeyword;
    const keywordsList = keywords.map(k => k.keyword).join(', ');
    
    // Extract and format the content from posts
    let postsContent = '';
    sourcePosts.forEach(source => {
      postsContent += `Posts about "${source.keyword}":\n`;
      
      source.posts.forEach((post: any, index: number) => {
        if (index < 3) { // Limit to 3 posts per keyword to keep prompt size manageable
          postsContent += `- Title: ${post.title}\n`;
          postsContent += `  Description: ${post.description || 'No description'}\n`;
          if (post.comments && post.comments.length > 0) {
            postsContent += `  Top comment: ${post.comments[0].body || 'No content'}\n`;
          }
          postsContent += '\n';
        }
      });
    });
    
    // Construct the prompt for Gemini
    const prompt = `
    I'm analyzing the topic "${mainKeyword}" and related keywords (${keywordsList}).
    Here are some posts from Dev.to about these topics:
    
    ${postsContent}
    
    Based on this information, provide the following:
    
    1. PROBLEMS: List 3-5 problems that people face related to "${mainKeyword}" based on the context. Format each as "Problem: {title}, Context: {brief context}, Pain point: {specific pain}, Emotions: [{emotions}]"
    
    2. PRODUCT IDEAS: Suggest 3-5 potential product ideas that could solve these problems. Format each as "Product: {product name}, Description: {what it does}, Problem solved: {which problem}, Target audience: {who would use it}, Key features: {list key features}"
    
    3. SENTIMENT: Analyze the overall sentiment around "${mainKeyword}" (positive, negative, or mixed) and explain why in a few sentences.
    
    Make your responses data-driven and based on the content provided, not speculative. Present each section clearly with numbered items.
    `;
    
    // Call Gemini
    return await sendPrompt(prompt);
  } catch (error) {
    console.error("Failed to process with Gemini:", error);
    throw error;
  }
}

/**
 * Saves the Gemini analysis results to the LLM Insights collection
 */
async function saveLLMInsights(explorationId: mongoose.Types.ObjectId, geminiResponse: string) {
  try {
    // Parse response to extract problems and product ideas
    const problemsMatch = geminiResponse.match(/PROBLEMS:[\s\S]*?(?=\n\s*\n\s*\d+\.|$)/i);
    const productsMatch = geminiResponse.match(/PRODUCT IDEAS:[\s\S]*?(?=\n\s*\n\s*\d+\.|$)/i);
    const sentimentMatch = geminiResponse.match(/SENTIMENT:[\s\S]*?(?=\n\s*\n|$)/i);
    
    const problems = extractNumberedItems(problemsMatch ? problemsMatch[0] : '');
    const productIdeas = extractNumberedItems(productsMatch ? productsMatch[0] : '');
    const sentiment = sentimentMatch ? sentimentMatch[0].replace(/SENTIMENT:\s*/i, '').trim() : '';
    
    // Save to database
    const insight = await LLMInsight.create({
      explorationId,
      rawResponse: geminiResponse,
      problems,
      productIdeas,
      sentiment,
      status: 'completed',
      createdAt: new Date()
    });
    
    return insight;
  } catch (error) {
    console.error("Failed to save LLM insights:", error);
    throw error;
  }
}

/**
 * Helper function to extract numbered items from text sections
 */
function extractNumberedItems(text: string): string[] {
  if (!text) return [];
  
  // Remove section title (e.g., "PROBLEMS:")
  const cleanText = text.replace(/^[^:]*:\s*/i, '');
  
  // Look for numbered patterns like "1. Item" or "1) Item"
  const matches = cleanText.match(/(?:\d+[\.\)]\s*[^0-9\n]+|\n\s*-\s*[^\n]+)/g);
  
  if (!matches) return [cleanText.trim()]; // Return the whole text if no numbered items
  
  return matches.map(item => 
    item.replace(/^\s*\d+[\.\)]\s*|-\s*/g, '').trim()
  ).filter(item => item.length > 0);
}

/**
 * Marks the exploration as completed
 */
async function markExplorationComplete(explorationId: mongoose.Types.ObjectId) {
  try {
    await KeywordExploration.findByIdAndUpdate(explorationId, {
      completed: true,
      completedAt: new Date()
    });
  } catch (error) {
    console.error("Failed to mark exploration as complete:", error);
    throw error;
  }
}
