import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Base API client for making HTTP requests
export default class ApiClient {
  // Default headers with a modern user agent and other required headers
  private static defaultHeaders = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: "https://www.google.com/",
    "sec-ch-ua":
      '"Microsoft Edge";v="121", "Not A(Brand";v="24", "Chromium";v="121"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    Cookie: "", // Some sites require cookies
  };

  // Default request configuration
  private static defaultConfig: AxiosRequestConfig = {
    timeout: 15000, // 15 seconds timeout
    validateStatus: (status) => status < 500, // Accept 4xx status codes to handle them ourselves
  };

  /**
   * Make a GET request to the specified URL
   * @param url The URL to fetch
   * @param additionalHeaders Any additional headers to include in the request
   * @returns The response from the server
   */
  static async get(
    url: string,
    additionalHeaders: Record<string, string> = {}
  ): Promise<AxiosResponse> {
    console.log(`ApiClient: Fetching ${url}`);
    
    try {
      const response = await axios.get(url, {
        headers: {
          ...this.defaultHeaders,
          ...additionalHeaders,
        },
        ...this.defaultConfig,
      });

      console.log(
        `ApiClient: Fetched ${response.data.length} characters from ${url} (Status: ${response.status})`
      );
      
      return response;
    } catch (error) {
      console.error(`ApiClient: Error fetching ${url}:`, error);
      throw error;
    }
  }

  /**
   * Clean HTML content by removing scripts and styles
   * @param html The HTML content to clean
   * @returns The cleaned HTML content
   */
  static cleanHtml(html: string): string {
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "");
    
    console.log("ApiClient: Cleaned HTML content, length:", cleaned.length);
    return cleaned;
  }
}
