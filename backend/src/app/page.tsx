'use client';

import { useState } from 'react';

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

interface DevToPost {
  title: string;
  url: string;
  author: string;
  published_at: string;
  description: string;
  comments_count: number;
  positive_reactions_count: number;
  tags: string[];
  id: number | string;
  comments: DevToComment[];
}

interface DevToComment {
  id: string;
  body: string;
  author: string;
  created_at: string;
  positive_reactions_count: number;
  children: DevToComment[];
}

interface KeywordData {
  keyword: string;
  volume: number;
  cpc: number;
  competition_value: string;
  search_intent: string;
  source: string;
  avg_monthly_searches: number[];
}

interface KeywordResponse {
  total_keywords: number;
  search_question: string;
  search_country: string;
  keywords: KeywordData[];
}

export default function ApiTester() {
  const [activeTab, setActiveTab] = useState<'x' | 'devto' | 'keywords'>('x');
  
  // X API State
  const [xQuery, setXQuery] = useState('');
  const [xQueryType, setXQueryType] = useState('Latest');
  const [xLimit, setXLimit] = useState('10');
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [xLoading, setXLoading] = useState(false);
  const [xError, setXError] = useState('');

  // Dev.to API State
  const [devToKeyword, setDevToKeyword] = useState('');
  const [devToTag, setDevToTag] = useState('');
  const [devToLimit, setDevToLimit] = useState('10');
  const [devToPosts, setDevToPosts] = useState<DevToPost[]>([]);
  const [devToLoading, setDevToLoading] = useState(false);
  const [devToError, setDevToError] = useState('');

  // Keyword Generator API State
  const [keywordQuery, setKeywordQuery] = useState('');
  const [keywordCountry, setKeywordCountry] = useState('en-US');
  const [keywordResults, setKeywordResults] = useState<KeywordResponse | null>(null);
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [keywordError, setKeywordError] = useState('');

  const handleXSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xQuery.trim()) {
      setXError('Query is required');
      return;
    }

    setXLoading(true);
    setXError('');
    setTweets([]);

    try {
      const params = new URLSearchParams({
        query: xQuery.trim(),
        queryType: xQueryType,
        limit: xLimit || '10'
      });

      const response = await fetch(`/api/x_api?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tweets');
      }
      
      const data = await response.json();
      setTweets(data);
    } catch (err: any) {
      setXError(err.message || 'An error occurred while fetching tweets');
    } finally {
      setXLoading(false);
    }
  };

  const handleDevToSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devToKeyword.trim() && !devToTag.trim()) {
      setDevToError('Either keyword or tag is required');
      return;
    }

    setDevToLoading(true);
    setDevToError('');
    setDevToPosts([]);

    try {
      const params = new URLSearchParams();
      if (devToKeyword.trim()) params.set('keyword', devToKeyword.trim());
      if (devToTag.trim()) params.set('tag', devToTag.trim());
      if (devToLimit) params.set('limit', devToLimit);

      const response = await fetch(`/api/dev_to_api?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch Dev.to posts');
      }
      
      const data = await response.json();
      setDevToPosts(data);
    } catch (err: any) {
      setDevToError(err.message || 'An error occurred while fetching Dev.to posts');
    } finally {
      setDevToLoading(false);
    }
  };

  const handleKeywordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordQuery.trim()) {
      setKeywordError('Keyword query is required');
      return;
    }

    setKeywordLoading(true);
    setKeywordError('');
    setKeywordResults(null);

    try {
      const params = new URLSearchParams({
        keyword: keywordQuery.trim(),
        country: keywordCountry
      });

      const response = await fetch(`/api/keyword_generator_api?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate keywords');
      }
      
      const data = await response.json();
      setKeywordResults(data);
    } catch (err: any) {
      setKeywordError(err.message || 'An error occurred while generating keywords');
    } finally {
      setKeywordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            API Tester
          </h1>
          <p className="text-gray-600">
            Test and view responses from X (Twitter), Dev.to, and Keyword Generator API endpoints
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('x')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'x'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X (Twitter)
              </span>
            </button>
            <button
              onClick={() => setActiveTab('devto')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'devto'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45h.56c.38 0 .66-.08.84-.23.18-.16.28-.39.28-.68v-2.07c0-.29-.1-.52-.28-.68zm14.56-4.04v-.07c0-.15-.11-.26-.26-.26h-4.02c-.15 0-.26.11-.26.26v.07a.26.26 0 00.26.26h1.5v2.75c-.13.22-.36.36-.62.36-.33 0-.5-.13-.5-.39V6.11c0-.16-.11-.27-.26-.27h-.85c-.16 0-.27.11-.27.27v3.23c0 .72.38 1.08 1.15 1.08.53 0 .9-.2 1.15-.59v.47c0 .15.11.26.26.26h.85c.15 0 .26-.11.26-.26V6.37h1.5c.15 0 .26-.11.26-.26zM24 0H0v24h24V0zM8.56 10.05c.33-.16.57-.47.57-.97 0-.72-.42-1.15-1.13-1.15H6v4.26c0 .16.11.26.26.26h.85c.16 0 .26-.1.26-.26v-1.07h.74l.66 1.24c.05.1.15.16.26.16h.92c.21 0 .33-.18.26-.37L8.56 10.05zm6.58-1.48c-.44 0-.81.17-1.09.51-.3.36-.45.82-.45 1.38 0 .56.15 1.02.45 1.38.28.34.65.51 1.09.51.44 0 .81-.17 1.09-.51.3-.36.45-.82.45-1.38 0-.56-.15-1.02-.45-1.38-.28-.34-.65-.51-1.09-.51z"/>
                </svg>
                Dev.to
              </span>
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'keywords'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5Z"/>
                </svg>
                Keywords
              </span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {activeTab === 'x' ? (
              <form onSubmit={handleXSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Query Input */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search Query *
                    </label>
                    <input
                      type="text"
                      value={xQuery}
                      onChange={(e) => setXQuery(e.target.value)}
                      placeholder="Enter search query (e.g., 'React development')"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Limit Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Limit
                    </label>
                    <input
                      type="number"
                      value={xLimit}
                      onChange={(e) => setXLimit(e.target.value)}
                      placeholder="10"
                      min="1"
                      max="500"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Query Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Query Type
                  </label>
                  <select
                    value={xQueryType}
                    onChange={(e) => setXQueryType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="Latest">Latest</option>
                    <option value="Popular">Popular</option>
                    <option value="Top">Top</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={xLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
                >
                  {xLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Fetching Tweets...
                    </>
                  ) : (
                    'Fetch Tweets'
                  )}
                </button>
              </form>
            ) : activeTab === 'devto' ? (
              <form onSubmit={handleDevToSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Keyword Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Keyword
                    </label>
                    <input
                      type="text"
                      value={devToKeyword}
                      onChange={(e) => setDevToKeyword(e.target.value)}
                      placeholder="Enter keyword (e.g., 'react')"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Tag Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tag
                    </label>
                    <input
                      type="text"
                      value={devToTag}
                      onChange={(e) => setDevToTag(e.target.value)}
                      placeholder="Enter tag (e.g., 'javascript')"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Limit Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Limit
                    </label>
                    <input
                      type="number"
                      value={devToLimit}
                      onChange={(e) => setDevToLimit(e.target.value)}
                      placeholder="10"
                      min="1"
                      max="100"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  * Either keyword or tag is required
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={devToLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
                >
                  {devToLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Fetching Posts...
                    </>
                  ) : (
                    'Fetch Dev.to Posts'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleKeywordSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Keyword Query Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search Query *
                    </label>
                    <input
                      type="text"
                      value={keywordQuery}
                      onChange={(e) => setKeywordQuery(e.target.value)}
                      placeholder="Enter search query (e.g., 'best smartphones 2025')"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Country Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country/Language
                    </label>
                    <select
                      value={keywordCountry}
                      onChange={(e) => setKeywordCountry(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="en-US">United States (en-US)</option>
                      <option value="en-GB">United Kingdom (en-GB)</option>
                      <option value="en-CA">Canada (en-CA)</option>
                      <option value="en-AU">Australia (en-AU)</option>
                      <option value="de-DE">Germany (de-DE)</option>
                      <option value="fr-FR">France (fr-FR)</option>
                      <option value="es-ES">Spain (es-ES)</option>
                      <option value="it-IT">Italy (it-IT)</option>
                      <option value="pt-BR">Brazil (pt-BR)</option>
                      <option value="ja-JP">Japan (ja-JP)</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={keywordLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
                >
                  {keywordLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Keywords...
                    </>
                  ) : (
                    'Generate Keywords'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Error Display */}
        {(xError || devToError || keywordError) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{xError || devToError || keywordError}</p>
              </div>
            </div>
          </div>
        )}

        {/* X API Results */}
        {tweets.length > 0 && activeTab === 'x' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              X Results ({tweets.length} tweets)
            </h2>
            
            <div className="space-y-6">
              {tweets.map((tweet) => (
                <div key={tweet.id} className="border-l-4 border-blue-500 bg-gray-50 p-6 rounded-r-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <p className="text-gray-800 text-lg leading-relaxed mb-3">
                        {tweet.text}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          {tweet.likeCount} likes
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                          {tweet.replyCount} replies
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                          {tweet.retweetCount} retweets
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <a
                        href={tweet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Tweet →
                      </a>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(tweet.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Comments */}
                  {tweet.comments.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-300">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Comments ({tweet.comments.length})
                      </h4>
                      <div className="space-y-3">
                        {tweet.comments.slice(0, 3).map((comment, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg">
                            <p className="text-gray-700 text-sm">{comment.text}</p>
                            <div className="flex gap-3 mt-2 text-xs text-gray-500">
                              <span>{comment.likeCount} likes</span>
                              <span>{comment.replyCount} replies</span>
                            </div>
                          </div>
                        ))}
                        {tweet.comments.length > 3 && (
                          <p className="text-xs text-gray-500">
                            ... and {tweet.comments.length - 3} more comments
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dev.to Results */}
        {devToPosts.length > 0 && activeTab === 'devto' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Dev.to Results ({devToPosts.length} posts)
            </h2>
            
            <div className="space-y-6">
              {devToPosts.map((post) => (
                <div key={post.id} className="border-l-4 border-green-500 bg-gray-50 p-6 rounded-r-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed mb-3">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          {post.positive_reactions_count} reactions
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                          {post.comments_count} comments
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          by {post.author}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        View Post →
                      </a>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.published_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-300">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Comments ({post.comments.length})
                      </h4>
                      <div className="space-y-3">
                        {post.comments.slice(0, 3).map((comment, index) => (
                          <div key={comment.id} className="bg-white p-3 rounded-lg">
                            <p className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: comment.body }}></p>
                            <div className="flex gap-3 mt-2 text-xs text-gray-500">
                              <span>by {comment.author}</span>
                              <span>{comment.positive_reactions_count} reactions</span>
                              <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            {/* Nested comments */}
                            {comment.children.length > 0 && (
                              <div className="ml-4 mt-3 pl-3 border-l border-gray-200">
                                {comment.children.slice(0, 2).map((nestedComment, nestedIndex) => (
                                  <div key={nestedComment.id} className="mb-2 text-xs">
                                    <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: nestedComment.body }}></p>
                                    <span className="text-gray-400">by {nestedComment.author}</span>
                                  </div>
                                ))}
                                {comment.children.length > 2 && (
                                  <p className="text-xs text-gray-400">... and {comment.children.length - 2} more replies</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        {post.comments.length > 3 && (
                          <p className="text-xs text-gray-500">
                            ... and {post.comments.length - 3} more comments
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyword Generator Results */}
        {keywordResults && activeTab === 'keywords' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Keyword Results ({keywordResults.total_keywords} keywords)
              </h2>
              <div className="text-sm text-gray-600">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  {keywordResults.search_country}
                </span>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-purple-50 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Search Query</h3>
              <p className="text-purple-700">{keywordResults.search_question}</p>
            </div>

            <div className="space-y-4">
              {keywordResults.keywords.slice(0, 20).map((keyword, index) => (
                <div key={index} className="border-l-4 border-purple-500 bg-gray-50 p-6 rounded-r-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {keyword.keyword}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white p-3 rounded-lg">
                          <div className="text-gray-500 text-xs">Search Volume</div>
                          <div className="text-lg font-semibold text-blue-600">
                            {keyword.volume.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="text-gray-500 text-xs">CPC</div>
                          <div className="text-lg font-semibold text-green-600">
                            ${keyword.cpc.toFixed(2)}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="text-gray-500 text-xs">Competition</div>
                          <div className={`text-sm font-semibold ${
                            keyword.competition_value === 'LOW' ? 'text-green-600' :
                            keyword.competition_value === 'MEDIUM' ? 'text-yellow-600' :
                            keyword.competition_value === 'HIGH' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {keyword.competition_value}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="text-gray-500 text-xs">Search Intent</div>
                          <div className="text-sm font-semibold text-purple-600">
                            {keyword.search_intent}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-xs text-gray-500">Source</div>
                      <div className="text-sm font-semibold text-gray-700">
                        {keyword.source}
                      </div>
                    </div>
                  </div>

                  {/* Monthly Search Trends */}
                  {keyword.avg_monthly_searches && keyword.avg_monthly_searches.length > 0 && (
                    <div className="mt-4 p-4 bg-white rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Monthly Search Trend (Last 12 months)
                      </h4>
                      <div className="flex items-end space-x-1 h-16">
                        {keyword.avg_monthly_searches.slice(0, 12).map((volume, monthIndex) => {
                          const maxVolume = Math.max(...keyword.avg_monthly_searches.slice(0, 12));
                          const height = maxVolume > 0 ? (volume / maxVolume) * 100 : 0;
                          return (
                            <div key={monthIndex} className="flex-1 flex flex-col items-center">
                              <div
                                className="w-full bg-purple-500 rounded-t-sm min-h-[2px] transition-all duration-300"
                                style={{ height: `${Math.max(height, 2)}%` }}
                                title={`Month ${monthIndex + 1}: ${volume.toLocaleString()} searches`}
                              ></div>
                              <div className="text-xs text-gray-400 mt-1">
                                {monthIndex + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {keywordResults.keywords.length > 20 && (
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-600">
                    Showing top 20 keywords out of {keywordResults.keywords.length} total results
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Results */}
        {!xLoading && !devToLoading && !keywordLoading && (
          <>
            {activeTab === 'x' && tweets.length === 0 && !xError && xQuery && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-600">
                      No tweets found for your query. Try a different search term.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'devto' && devToPosts.length === 0 && !devToError && (devToKeyword || devToTag) && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-600">
                      No Dev.to posts found for your search. Try different keywords or tags.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'keywords' && !keywordResults && !keywordError && keywordQuery && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-600">
                      No keywords found for your query. Try a different search term.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}