import { SourceConfig } from "../app/api/scrap-problem/cheerio-types";
import {
  StackOverflowClient,
  RedditClient,
  GitHubClient,
  DevToClient,
  StackExchangeClient
} from "./source-clients";

/**
 * Factory class to create appropriate source clients
 */
export default class SourceClientFactory {
  /**
   * Create a client for the specified source
   * @param source The source name
   * @param config The source configuration
   * @returns A client instance for the specified source
   */
  static createClient(source: string, config: SourceConfig) {
    switch(source) {
      case 'stackoverflow':
        return new StackOverflowClient(config);
      case 'reddit':
        return new RedditClient(config);
      case 'github':
        return new GitHubClient(config);
      case 'devto':
        return new DevToClient(config);
      case 'stackexchange':
        return new StackExchangeClient(config);
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  }
}
