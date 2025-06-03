import ApiClient from "./api-client";
import { SourceConfig } from "../app/api/scrap-problem/cheerio-types";

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
