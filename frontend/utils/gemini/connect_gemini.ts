import dotenv from 'dotenv';
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

dotenv.config();

/**
 * Sends a prompt to the Gemini API using the model gemini-2.0-flash-exp and retrieves the response.
 * @param prompt - The prompt to send to the API.
 * @returns The response from the API as a string.
 */
async function sendPrompt(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('❌ Gemini API key is not defined in the .env file');
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

