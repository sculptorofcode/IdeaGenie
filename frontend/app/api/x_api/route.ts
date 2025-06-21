import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';
dotenv.config();

// Types for tweet and comment
interface Tweet {
  url: string;
  createdAt: string;
  id: string;
  text: string;
  retweetCount: number;
  replyCount: number;
  likeCount: number;
  comments: TweetComment[];
}

interface TweetComment {
  text: string;
  likeCount: number;
  replyCount: number;
}

// Function to fetch replies to a specific tweet using TwitterAPI.io
async function fetchTweetReplies(apiKey: string, tweetId: string, limit = 200): Promise<TweetComment[]> {
  try {
    const url = 'https://api.twitterapi.io/twitter/tweet/replies';
    const params = {
      tweetId: tweetId,
      limit: limit
    };

    const response = await axios.get(url, {
      params: params,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    if (!data.tweets) {
      return [];
    }

    const comments: TweetComment[] = [];
    data.tweets.forEach((reply: any) => {
      if (reply.lang && reply.lang.toLowerCase() === 'en') {
        comments.push({
          text: reply.text,
          likeCount: reply.likeCount,
          replyCount: reply.replyCount
        });
      }
    });
    return comments;
  } catch (error) {
    console.error('Error fetching tweet replies:', error);
    return [];
  }
}

// Function to fetch tweets from TwitterAPI.io using advanced search
export async function fetchTweets(apiKey: string, query: string, queryType = 'Latest', limit = 50): Promise<any> {
  try {
    const url = 'https://api.twitterapi.io/twitter/tweet/advanced_search';
    const params = {
      query: query,
      limit: limit,
      queryType: queryType
    };

    const response = await axios.get(url, {
      params: params,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
}

// Function to clean and extract relevant fields from tweets
async function formatTweets(tweets: any, apiKey: string): Promise<Tweet[]> {
  const filtered: Tweet[] = [];
  if (!tweets.tweets) {
    return filtered;
  }
  for (const tweet of tweets.tweets) {
    if (tweet.lang && tweet.lang.toLowerCase() === 'en') {
      let comments: TweetComment[] = [];
      if (tweet.replyCount > 0) {
        comments = await fetchTweetReplies(apiKey, tweet.id);
      }
      filtered.push({
        url: tweet.url,
        createdAt: tweet.createdAt,
        id: tweet.id,
        text: tweet.text,
        retweetCount: tweet.retweetCount,
        replyCount: tweet.replyCount,
        likeCount: tweet.likeCount,
        comments: comments
      });
    }
  }
  return filtered;
}

export async function getTweetsHandler(query: string, queryType: string = 'Latest', limit: number = 50): Promise<Tweet[]> {
    const apiKey = process.env.X_API_KEY || "22c6940501914ef984d441e6446fe19a";
    if (!apiKey) {
        console.log("api: ", apiKey);
        console.error('Missing X_API_KEY in environment variables');
        throw new Error(JSON.stringify({ error: 'Missing API_KEY' }));
    }
    try {

        // Fetch tweets
        const response = await fetchTweets(apiKey, query, queryType, limit);
        // Format tweets with comments
        const filteredTweets = await formatTweets(response, apiKey);
        return filteredTweets;
    } catch (error) {
        console.error('Error in X.com API route:', error);
        return [];
    }
}

// Next.js API Route Handler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const queryType = searchParams.get('queryType') || 'Latest';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const tweets = await getTweetsHandler(query, queryType, limit);
    return NextResponse.json(tweets);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tweets' }, { status: 500 });
  }
}