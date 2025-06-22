"use client";

import { useState } from 'react';
import GeminiApiCheck from '../../../components/gemini/GeminiApiCheck';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { testGeminiApiKey } from '../../../utils/gemini/apiCheck';

export default function GeminiApiSettingsPage() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdvancedTest = async () => {
    setIsLoading(true);
    try {
      const result = await testGeminiApiKey();
      setTestResult(result.testResponse || 'No response received');
    } catch (error) {
      setTestResult('Error testing API: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gemini API Settings</h1>
      
      <GeminiApiCheck showTestButton={true} showAddKeyLink={true} />
      
      <div className="grid gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>About Gemini API</CardTitle>
            <CardDescription>
              Google&apos;s Gemini API powers the AI features in IdeaGenie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              IdeaGenie uses Google&apos;s Gemini API to generate insights, analyze data, 
              and power various AI features throughout the application. To use these features,
              you must configure a valid Gemini API key.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="font-medium text-blue-800">Get started with Gemini API</h3>
              <ol className="list-decimal list-inside ml-2 mt-2 space-y-2 text-blue-700">
                <li>Visit <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a> and create an account</li>
                <li>Navigate to &quot;API keys&quot; section and generate a new API key</li> 
                <li>Copy the API key and add it to your <code className="bg-blue-100 px-1.5 py-0.5 rounded">.env.local</code> file</li>
                <li>Set the environment variable as <code className="bg-blue-100 px-1.5 py-0.5 rounded">GEMINI_API_KEY=your-api-key</code></li>
                <li>Restart your development server</li>
              </ol>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          variant="outline" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full md:w-auto"
        >
          {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
        </Button>
        
        {showAdvanced && (
          <Card>
            <CardHeader>
              <CardTitle>Advanced API Testing</CardTitle>
              <CardDescription>
                Run specific tests to verify your API configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleAdvancedTest}
                disabled={isLoading}
              >
                {isLoading ? "Testing..." : "Run Advanced API Test"}
              </Button>
              
              {testResult && (
                <div className="p-4 bg-gray-50 rounded-md border mt-4">
                  <h3 className="text-sm font-medium mb-2">API Response:</h3>
                  <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded border overflow-auto max-h-40">
                    {testResult}
                  </pre>
                </div>
              )}
              
              <div className="text-sm text-gray-500 mt-4">
                <p>The advanced test sends a simple prompt to the Gemini API and displays the raw response. 
                This helps diagnose any issues with your API key or connection.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
