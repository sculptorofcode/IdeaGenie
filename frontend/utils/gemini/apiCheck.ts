/**
 * Utility functions for checking Gemini API configuration
 */

/**
 * Check if the Gemini API key is properly configured
 * @returns Object containing status information about the Gemini API configuration
 */
export async function checkGeminiApiConfig() {
  try {
    const response = await fetch('/api/check-gemini-api');
    const result = await response.json();
    
    return {
      isConfigured: response.ok && result.configured,
      message: result.message,
      status: result.status,
      details: result
    };
  } catch (error) {
    console.error('Error checking Gemini API configuration:', error);
    return {
      isConfigured: false,
      message: 'Error connecting to Gemini API configuration endpoint',
      status: 'error',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

/**
 * Test if the Gemini API key is valid and working
 * @returns Object containing validation results 
 */
export async function testGeminiApiKey() {
  try {
    const response = await fetch('/api/check-gemini-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });
    
    const result = await response.json();
    
    return {
      isWorking: response.ok && result.working,
      isConfigured: result.configured,
      message: result.message,
      status: result.status,
      testResponse: result.testResponse,
      details: result
    };
  } catch (error) {
    console.error('Error testing Gemini API key:', error);
    return {
      isWorking: false,
      isConfigured: false,
      message: 'Error connecting to Gemini API test endpoint',
      status: 'error',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}
