import dotenv from 'dotenv';
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

dotenv.config();

/**
 * Check if the Gemini API key is configured
 * @returns True if the API key is configured, false otherwise
 */
export function isGeminiApiConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '');
}

/**
 * Sends a prompt to the Gemini API using the model gemini-2.0-flash-exp and retrieves the response.
 * @param prompt - The prompt to send to the API.
 * @returns The response from the API as a string.
 */
async function sendPrompt(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      // Check if we're in a client-side environment to suggest appropriate solutions
      const isClient = typeof window !== 'undefined';
      
      if (isClient) {
        throw new Error('❌ Gemini API key is not available. Please check your API configuration or contact support.');
      } else {
        throw new Error('❌ Gemini API key is not defined in the .env file');
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model: GenerativeModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error('Error communicating with Gemini API:', error.message || error);
    throw error;
  }
}

export default sendPrompt;

