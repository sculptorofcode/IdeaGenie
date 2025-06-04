import ApiClient from "./api-client";
import { SourceConfig } from "../app/api/scrap-problem/cheerio-types";
import dotenv from "dotenv";
import axios from "axios";
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
  private clientId: string;
  private secret: string;
  private username: string;
  private appName: string;
  private accessToken: string | null = null;

  constructor(config: SourceConfig) {
    this.config = config;
    this.clientId = process.env.REDIT_CLIENT_ID || "";
    this.secret = process.env.REDIT_SECRET_KEY || "";
    this.username = process.env.REDIT_USERNAME || "";
    this.appName = process.env.REDIT_APP_NAME || "";
  }

  // Authenticate and get access token
  private async authenticate(): Promise<string> {
    if (this.accessToken) return this.accessToken || "";
    const auth = Buffer.from(`${this.clientId}:${this.secret}`).toString("base64");
    const response = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "User-Agent": `${this.appName}/0.1 by ${this.username}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    this.accessToken = response.data.access_token || "";
    return this.accessToken || "";
  }

  /**
   * Recursively build nested comment structure
   */
  private buildNestedComments(comments: any[], parentId: string | null = null): any {
    const result: any = {};
    let idx = 1;
    comments
      .filter((c) => c.data.parent_id && c.data.parent_id.endsWith(parentId || c.data.link_id.split('_')[1]))
      .forEach((c) => {
        if (c.data.replies && c.data.replies.data && c.data.replies.data.children.length > 0) {
          result[idx.toString()] = {
            body: c.data.body,
            comment: this.buildNestedComments(c.data.replies.data.children, c.data.id),
          };
        } else {
          result[idx.toString()] = { body: c.data.body };
        }
        idx++;
      });
    return result;
  }

  /**
   * Fetch content from Reddit using the API
   * @returns The structured content as stringified JSON
   */
  async fetchContent(): Promise<string> {
    const accessToken = await this.authenticate();
    // Extract subreddit from config.url (e.g., https://www.reddit.com/r/programming/)
    const match = this.config.url.match(/reddit.com\/r\/([a-zA-Z0-9_]+)/);
    const subreddit = match ? match[1] : "programming";
    const apiUrl = `https://oauth.reddit.com/r/${subreddit}/top?limit=10`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": `${this.appName}/0.1 by ${this.username}`,
      },
    });
    const posts = response.data.data.children || [];
    const results = [];
    for (const p of posts) {
      const postId = p.data.id;
      const permalink = p.data.permalink;
      // Fetch comments for this post
      const commentsUrl = `https://oauth.reddit.com${permalink}.json?limit=100`;
      const commentsResp = await axios.get(commentsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": `${this.appName}/0.1 by ${this.username}`,
        },
      });
      // Reddit returns an array, second element is comments
      const commentListing = commentsResp.data[1]?.data?.children || [];
      const commentObj = this.buildNestedComments(commentListing, postId);
      results.push({
        title: p.data.title,
        post_url: p.data.url,
        coment_no: p.data.num_comments,
        comment: commentObj,
      });
    }
    return JSON.stringify(results, null, 2);
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
    this.apiKey = (process.env.STACK_EXCHANGE_API_KEY || "").trim();
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
