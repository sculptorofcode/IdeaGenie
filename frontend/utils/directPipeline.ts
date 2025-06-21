/**
 * This file provides a direct implementation of the keyword pipeline
 * that can be used without going through API routes.
 * It performs all the same functionality as the previous pipeline but
 * without the API layer.
 */

// Import utilities but not mongoose models directly
import { fetchKeywordData } from './keywords/keywordGenerator';
import { searchDevToPosts } from './sources/devtoService';
import sendPrompt from './gemini/connect_gemini';

// Using types only for TypeScript support (not importing the actual models)
import type { IKeywordExploration } from '../models/KeywordExploration';
import type { ISourceData } from '../models/SourceData';
import type { ILLMInsight } from '../models/LLMInsight';

// Pipeline interface
interface KeywordPipelineOptions {
  userId: string;
  mainKeyword: string;
  country?: string;
}

// Type representing a subkeyword
interface Subkeyword {
  keyword: string;
  volume?: number;
  cpc?: number;
  intent?: string;
  competition?: number | string;
  trend?: Array<{
    month: string;
    year: number;
    searches: number;
  }>;
  score?: number;
}

/**
 * Main pipeline function that orchestrates the entire keyword processing flow
 * This is now a client-safe version that uses API routes instead of direct DB access
 */
export async function runKeywordPipelineDirect({ userId, mainKeyword, country = 'en-US' }: KeywordPipelineOptions) {
  try {    // Validate that we have a valid userId - must be a valid MongoDB ObjectId format
    if (!userId || userId.startsWith('user-') || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      throw new Error('Valid authenticated user ID is required. Please sign in first.');
    }
    
    console.log(`Starting pipeline for keyword: ${mainKeyword} and user: ${userId}`);
    
    // Step 1: Start a new exploration via API
    const startResponse = await fetch('/api/pipeline/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, mainKeyword, country })
    });
    
    if (!startResponse.ok) {
      const errorData = await startResponse.json();
      throw new Error(errorData.message || 'Failed to start exploration');
    }
    
    const startData = await startResponse.json();
    const explorationId = startData.explorationId;
    console.log(`Created exploration with ID: ${explorationId}`);
    
    // Step 2: Generate subkeywords
    const subkeywords = await generateSubkeywords(mainKeyword, country);
    
    // Step 3: Update the exploration with subkeywords via API
    const updateResponse = await fetch('/api/pipeline/subkeywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ explorationId, subkeywords })
    });
    
    if (!updateResponse.ok) {
      throw new Error('Failed to update exploration with subkeywords');
    }
    
    // Step 4: Choose top 5 subkeywords by search volume and CPC
    const topKeywords = selectTopSubkeywords(subkeywords, 5);
    
    // Step 5: Search posts based on keywords (client-safe operation)
    const sourcePosts = [];
    for (const keyword of topKeywords) {
      // Call the devToService directly - this is safe for client-side
      const posts = await searchDevToPosts(keyword.keyword);
      sourcePosts.push({
        keyword: keyword.keyword,
        posts
      });
      
      // Save source data via API
      await fetch('/api/pipeline/save-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          explorationId, 
          keyword: keyword.keyword, 
          source: 'dev.to',
          data: posts 
        })
      });
    }
    
    // Step 6: Process with Gemini (client-side safe)
    const promptData = {
      mainKeyword,
      keywordsList: topKeywords.map(k => k.keyword).join(', '),
      sourcePosts
    };
    
    // Create a simplified version of the Gemini prompt
    const geminiPromptResponse = await fetch('/api/pipeline/gemini-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptData)
    });
    
    if (!geminiPromptResponse.ok) {
      throw new Error('Failed to generate Gemini prompt');
    }
    
    const { prompt } = await geminiPromptResponse.json();
    
    // Call Gemini (client-side safe)
    const geminiResult = await sendPrompt(prompt);
    
    // Step 7: Save LLM insights via API
    const insightResponse = await fetch('/api/pipeline/save-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        explorationId,
        geminiResponse: geminiResult
      })
    });
    
    if (!insightResponse.ok) {
      throw new Error('Failed to save LLM insights');
    }
    
    const { insightId } = await insightResponse.json();
    
    // Step 8: Mark exploration as complete via API
    const completeResponse = await fetch(`/api/pipeline/complete/${explorationId}`, {
      method: 'POST'
    });
    
    if (!completeResponse.ok) {
      throw new Error('Failed to mark exploration as complete');
    }
    
    return {
      success: true,
      explorationId,
      insightId,
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
 * Generates subkeywords for the main keyword using the keyword generator API
 * This function is client-safe as it doesn't directly access database
 */
async function generateSubkeywords(mainKeyword: string, country: string): Promise<Subkeyword[]> {
  try {
    // Call the keyword service directly instead of through the API
    const keywordData = await fetchKeywordData(mainKeyword, country);
    
    if (!keywordData.keywords || keywordData.keywords.length === 0) {
      throw new Error("No keywords returned from service");
    }    return keywordData.keywords.map(kw => ({
      keyword: String(kw.keyword || ''),
      volume: Number(kw.volume || 0),
      cpc: Number(kw.cpc || 0),
      intent: String(kw.search_intent || 'Unknown'),
      competition: String(kw.competition_value || 'UNKNOWN'),
      trend: kw.avg_monthly_searches ? 
        kw.avg_monthly_searches.map((searches: number, index: number) => {
          const date = new Date();
          // Create trend data for past 12 months
          date.setMonth(date.getMonth() - (11 - index));
          return {
            month: date.toLocaleString('default', { month: 'short' }),
            year: date.getFullYear(),
            searches: Number(searches) // Ensure searches is a number
          };
        }) : []
    }));
  } catch (error) {
    console.error("Failed to generate subkeywords:", error);
    throw error;
  }
}

/**
 * Selects top subkeywords based on a scoring formula that considers both search volume and CPC
 * This function is client-safe as it's pure computation
 */
function selectTopSubkeywords(subkeywords: Subkeyword[], count: number): Subkeyword[] {
  // Score each keyword by volume * cpc
  const scoredKeywords = subkeywords.map(kw => ({
    ...kw,
    score: (kw.volume || 0) * (kw.cpc || 0.1) // Ensure we don't multiply by zero
  }));
  
  // Sort by score (highest first) and take the top 'count'
  return scoredKeywords
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, count);
}

/**
 * Helper function to extract numbered items from text sections
 * This function is client-safe as it's pure string manipulation
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
