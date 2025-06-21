// mindMapHelper.ts
import mongoose from 'mongoose';
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

/**
 * Fetches the latest keyword exploration data for a given user
 * @returns An object containing exploration data with explorationId as a string
 */
export async function fetchLatestUserExploration(userId: string): Promise<{
  explorationId: string;
  mainKeyword: string;
  subkeywords: any[];
  completed: boolean;
}> {
  try {
    // Initialize models first
    initModels();
    
    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    // Get the latest exploration for this user
    const exploration = await KeywordExploration.findOne({ userId })
      .sort({ createdAt: -1 })
      .exec();
    
    if (!exploration) {
      throw new Error('No exploration found for this user');
    }    return {
      explorationId: String(exploration._id),
      mainKeyword: exploration.mainKeyword,
      subkeywords: exploration.subkeywords || [],
      completed: Boolean(exploration.completed)
    };
  } catch (error) {
    console.error("Failed to fetch user exploration:", error);
    throw error;
  }
}

/**
 * Fetches insight data generated for an exploration
 */
export async function fetchInsightData(explorationId: string) {
  try {
    // Initialize models first
    initModels();
    
    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    const insight = await LLMInsight.findOne({ explorationId }).exec();
    
    if (!insight) {
      throw new Error('No insight found for this exploration');
    }

    return {
      problems: insight.problems,
      productIdeas: insight.productIdeas,
      sentiment: insight.sentiment,
      status: insight.status
    };
  } catch (error) {
    console.error("Failed to fetch insight data:", error);
    throw error;
  }
}

/**
 * Fetches source data collected for an exploration
 */
export async function fetchSourceData(explorationId: string) {
  try {
    // Initialize models first
    initModels();
    
    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    const sourcesData = await SourceData.find({ explorationId }).exec();
    
    if (!sourcesData || sourcesData.length === 0) {
      throw new Error('No source data found for this exploration');
    }

    return sourcesData.map(source => ({
      source: source.source,
      keyword: source.keyword,
      posts: source.data
    }));
  } catch (error) {
    console.error("Failed to fetch source data:", error);
    throw error;
  }
}

/**
 * Gets all data for generating a mindmap from the pipeline results
 */
export async function getPipelineResultsForUser(userId: string) {
  try {
    const exploration = await fetchLatestUserExploration(userId);
    
    // explorationId is already a string based on our updated return type
    const insight = await fetchInsightData(exploration.explorationId);
    const sourceData = await fetchSourceData(exploration.explorationId);
    
    return {
      exploration,
      insight,
      sourceData
    };
  } catch (error) {
    console.error("Failed to get pipeline results:", error);
    throw error;
  }
}

// Get mindmap data directly without using API routes
export async function getLatestMindMapData(userId: string) {
  try {
    // Connect to MongoDB if needed
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    const results = await getPipelineResultsForUser(userId);
    
    return {
      success: true,
      data: results
    };
  } catch (error) {
    console.error("Error fetching mindmap data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error fetching mindmap data'
    };
  }
}
