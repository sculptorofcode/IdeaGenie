import { runKeywordPipelineDirect } from "../directPipeline";

/**
 * Executes the keyword pipeline process using provided parameters
 * This function uses a direct implementation instead of going through API routes
 * @param userId - The ID of the user initiating the pipeline
 * @param keyword - The main keyword to process
 * @param country - The country code for regional SEO data (defaults to en-US)
 * @returns The result of the pipeline execution
 */
export async function executeKeywordPipeline(userId: string, keyword: string, country: string = 'en-US') {
  if (!userId || !keyword) {
    throw new Error('Missing required parameters: userId and keyword');
  }

  try {
    const result = await runKeywordPipelineDirect({
      userId,
      mainKeyword: keyword,
      country
    });

    return result;
  } catch (error) {
    console.error("Pipeline execution error:", error);
    throw error;
  }
}

/**
 * Validates the required parameters for the keyword pipeline
 * @param userId - The user ID to validate
 * @param keyword - The keyword to validate
 * @returns An object indicating validity and any error message
 */
export function validatePipelineParams(userId?: string, keyword?: string) {
  if (!userId || !keyword) {
    return {
      isValid: false,
      errorMessage: 'Missing required parameters: userId and keyword'
    };
  }
  
  return {
    isValid: true,
    errorMessage: null
  };
}
