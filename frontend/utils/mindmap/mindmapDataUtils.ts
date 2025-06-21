import mongoose from 'mongoose';

// Dynamic imports for models
const KeywordExploration = mongoose.models.KeywordExploration || mongoose.model('KeywordExploration');
const SourceData = mongoose.models.SourceData || mongoose.model('SourceData');
const LLMInsight = mongoose.models.LLMInsight || mongoose.model('LLMInsight');

/**
 * Fetches the complete mind map data for a user
 * @param userId - The ID of the user to fetch data for
 * @returns An object containing all data needed to construct a mind map
 */
export async function fetchMindMapData(userId: string) {
  if (!userId) {
    throw new Error('userId is required');
  }

  // Connect to MongoDB if needed
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI || '');
  }

  try {
    // Get latest exploration
    const exploration = await fetchLatestUserExploration(userId);
    
    // Get insight data
    const insight = await fetchInsightData(exploration.explorationId);
    
    // Get source data
    const sourceData = await fetchSourceData(exploration.explorationId);
    
    return {
      success: true,
      data: {
        exploration,
        insight,
        sourceData
      }
    };
  } catch (error) {
    console.error("Error fetching mindmap data:", error);
    throw error;
  }
}

/**
 * Fetches the latest keyword exploration data for a given user
 * @param userId - The ID of the user
 * @returns The exploration data
 */
export async function fetchLatestUserExploration(userId: string) {
  try {
    // Get the latest exploration for this user
    const exploration = await KeywordExploration.findOne({ userId })
      .sort({ createdAt: -1 })
      .exec();
    
    if (!exploration) {
      throw new Error('No exploration found for this user');
    }

    return {
      explorationId: exploration._id,
      mainKeyword: exploration.mainKeyword,
      subkeywords: exploration.subkeywords,
      completed: exploration.completed
    };
  } catch (error) {
    console.error("Failed to fetch user exploration:", error);
    throw error;
  }
}

/**
 * Fetches insight data generated for an exploration
 * @param explorationId - The ID of the exploration
 * @returns The insight data
 */
export async function fetchInsightData(explorationId: string) {
  try {
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
 * @param explorationId - The ID of the exploration
 * @returns The source data
 */
export async function fetchSourceData(explorationId: string) {
  try {
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
