import ApiClient from "./api-client";
import { SourceConfig } from "../app/api/scrap-problem/cheerio-types";
import dotenv from "dotenv";
dotenv.config();

/**
 * Handles interactions with the StackOverflow website
 */
export class StackOverflowClient {
  private config: SourceConfig;
  
  constructor(config: SourceConfig) {
    this.config = config;
  }
  
  /**
   * Fetch content from StackOverflow
   * @returns The cleaned HTML content
   */
  async fetchContent(): Promise<string> {
    const response = await ApiClient.get(this.config.url);
    
    // Handle 403 Forbidden specifically for StackOverflow
    if (response.status === 403) {
      throw new Error(`Access forbidden by StackOverflow - the server is blocking automated requests`);
    }
    
    // Handle other non-200 responses
    if (response.status !== 200) {
      throw new Error(`StackOverflow server responded with status ${response.status}`);
    }
    
    return ApiClient.cleanHtml(response.data);
  }
}

/**
 * Handles interactions with the Reddit website
 */
export class RedditClient {
  private config: SourceConfig;
  
  constructor(config: SourceConfig) {
    this.config = config;
  }
  
  /**
   * Fetch content from Reddit
   * @returns The cleaned HTML content
   */
  async fetchContent(): Promise<string> {
    // Reddit might need additional headers or OAuth
    const response = await ApiClient.get(this.config.url);
    
    if (response.status === 403) {
      throw new Error(`Access forbidden by Reddit - the server is blocking automated requests`);
    }
    
    if (response.status !== 200) {
      throw new Error(`Reddit server responded with status ${response.status}`);
    }
    
    return ApiClient.cleanHtml(response.data);
  }
}

/**
 * Handles interactions with the GitHub website
 */
export class GitHubClient {
  private config: SourceConfig;
  
  constructor(config: SourceConfig) {
    this.config = config;
  }
  
  /**
   * Fetch content from GitHub
   * @returns The cleaned HTML content
   */
  async fetchContent(): Promise<string> {
    const response = await ApiClient.get(this.config.url);
    
    if (response.status === 403) {
      throw new Error(`Access forbidden by GitHub - the server is blocking automated requests`);
    }
    
    if (response.status !== 200) {
      throw new Error(`GitHub server responded with status ${response.status}`);
    }
    
    return ApiClient.cleanHtml(response.data);
  }
}

/**
 * Handles interactions with the Dev.to website
 */
export class DevToClient {
  private config: SourceConfig;
  
  constructor(config: SourceConfig) {
    this.config = config;
  }
  
  /**
   * Fetch content from Dev.to
   * @returns The cleaned HTML content
   */
  async fetchContent(): Promise<string> {
    const response = await ApiClient.get(this.config.url);
    
    if (response.status === 403) {
      throw new Error(`Access forbidden by Dev.to - the server is blocking automated requests`);
    }
    
    if (response.status !== 200) {
      throw new Error(`Dev.to server responded with status ${response.status}`);
    }
    
    return ApiClient.cleanHtml(response.data);
  }
}

/**
 * Handles interactions with the StackExchange website
 */
export class StackExchangeClient {
  private config: SourceConfig;
  private apiKey: string;
  private site: string;

  constructor(config: SourceConfig) {
    this.config = config;
    this.apiKey = (process.env.stack_exchange_api_key || "").trim();
    // Extract site from config.url (e.g., stackoverflow from https://stackoverflow.com/questions/)
    // Improved regex to handle subdomains and edge cases
    const match = this.config.url.match(/https?:\/\/(?:www\.)?([a-zA-Z0-9\-]+)\.stackexchange\.com|https?:\/\/(?:www\.)?([a-zA-Z0-9\-]+)\.com/);
    this.site = match ? (match[1] || match[2]) : "stackoverflow";
  }

  /**
   * Fetch content from StackExchange
   * @returns The structured content as stringified JSON
   */
  async fetchContent(): Promise<string> {
    // 1. Fetch questions
    const questionsUrl = `https://api.stackexchange.com/2.3/questions?order=desc&sort=activity&site=${this.site}&key=${this.apiKey}`;
    const questionsResp = await ApiClient.get(questionsUrl);
    const questions = questionsResp.data.items || [];
    const results: any[] = [];

    for (const q of questions) {
      const { title, link, question_id } = q;
      // 2. Fetch answers for this question
      const answersUrl = `https://api.stackexchange.com/2.3/questions/${question_id}/answers?order=desc&sort=activity&site=${this.site}&filter=withbody&key=${this.apiKey}`;
      const answersResp = await ApiClient.get(answersUrl);
      const answers = answersResp.data.items || [];
      if (!answers.length) continue; // skip if no answers
      const answer = answers[0]; // take the first answer
      const { answer_id, body } = answer;
      // 3. Fetch comments for this answer
      const commentsUrl = `https://api.stackexchange.com/2.3/answers/${answer_id}/comments?order=desc&sort=creation&site=${this.site}&filter=withbody&key=${this.apiKey}`;
      const commentsResp = await ApiClient.get(commentsUrl);
      const comments = commentsResp.data.items || [];
      const commentObj: Record<string, string> = {};
      comments.forEach((c: any, idx: number) => {
        commentObj[(idx + 1).toString()] = c.body;
      });
      results.push({
        question: title,
        answer: {
          body,
          comment: commentObj,
        },
        link,
        question_id,
      });
    }
    // Return as stringified JSON for compatibility
    return JSON.stringify(results, null, 2);
  }
}
