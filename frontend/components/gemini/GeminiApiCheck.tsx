"use client";

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  checkGeminiApiConfig, 
  testGeminiApiKey 
} from "../../utils/gemini/apiCheck";

type ApiStatus = {
  isConfigured: boolean;
  isWorking?: boolean;
  message: string;
  status: string;
  isLoading?: boolean;
  error?: string;
}

/**
 * Component to check Gemini API key configuration and display the status
 */
export default function GeminiApiCheck({ 
  showTestButton = true,
  showAddKeyLink = true,
  showOnlyError = false,
  className = ""
}: { 
  showTestButton?: boolean;
  showAddKeyLink?: boolean;
  showOnlyError?: boolean;
  className?: string;
}) {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    isConfigured: false,
    isWorking: undefined,
    message: "Checking Gemini API configuration...",
    status: "loading",
    isLoading: true
  });

  const checkApiConfig = async () => {
    setApiStatus(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await checkGeminiApiConfig();
      setApiStatus({
        ...result,
        isLoading: false,
        isWorking: undefined // Reset working status when just checking config
      });
    } catch (error) {
      setApiStatus({
        isConfigured: false,
        message: "Failed to check API configuration",
        status: "error",
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const testApiKey = async () => {
    setApiStatus(prev => ({ ...prev, isLoading: true, message: "Testing API key..." }));
    try {
      const result = await testGeminiApiKey();
      setApiStatus({
        ...result,
        isLoading: false
      });
    } catch (error) {
      setApiStatus(prev => ({
        ...prev,
        isWorking: false,
        message: "Failed to test API key",
        status: "error",
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }));
    }
  };

  useEffect(() => {
    checkApiConfig();
  }, []);

  // If configured and show only on error is true, don't show anything
  if (showOnlyError && apiStatus.isConfigured && apiStatus.isWorking !== false) {
    return null;
  }
  return (
    <div className={`gemini-api-check ${className}`}>
      <Card className={`mb-4 ${
        apiStatus.isConfigured ? "border-green-200" : 
        apiStatus.isLoading ? "border-yellow-200" : "border-red-200"
      }`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            {apiStatus.isLoading ? (
              <RefreshCw className="h-5 w-5 animate-spin text-yellow-600 mr-2" />
            ) : apiStatus.isConfigured ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
            )}
            
            {apiStatus.isLoading ? "Checking Gemini API" : 
             apiStatus.isConfigured ? "Gemini API Connected" : "Gemini API Configuration Error"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm">{apiStatus.message}</p>
          
          {apiStatus.isWorking === false && (
            <div className="mt-2 text-sm flex items-start">
              <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 text-amber-500" />
              <span>The API key is present but validation failed. This could indicate an invalid key or access issues.</span>
            </div>
          )}

          {!apiStatus.isConfigured && showAddKeyLink && (
            <div className="mt-3 text-sm">
              <p>To configure the Gemini API key:</p>
              <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                <li>Create a <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio account</a></li>
                <li>Generate an API key from the Google AI Studio</li>
                <li>Add the key to your <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file as <code className="bg-gray-100 px-1 py-0.5 rounded">GEMINI_API_KEY=your-key</code></li>
                <li>Restart your development server</li>
              </ol>
            </div>
          )}

          {showTestButton && (
            <div className="flex space-x-2 mt-3">
              <Button 
                size="sm" 
                variant={apiStatus.isConfigured ? "outline" : "default"}
                onClick={checkApiConfig} 
                disabled={apiStatus.isLoading}
              >
                Refresh Status
              </Button>
              
              {apiStatus.isConfigured && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={testApiKey}
                  disabled={apiStatus.isLoading}
                >
                  Test API Key
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
