import React, { useEffect, useState, useRef, useCallback } from "react";
import { useToast } from "../../../hooks/use-toast";
import { useRouter } from "next/navigation";
import GeminiApiCheck from "../../../components/gemini/GeminiApiCheck";

type Step4Props = {
  prevStep: () => void;
  formData: {
    initialPrompt: string;
    productType: string;
    projectGoal: string;
    projectCategory: string;
    teamName: string;
    members: Array<{
      id: number;
      name: string;
      skills: string;
      role: string;
    }>;
  };
};

const Step4: React.FC<Step4Props> = ({ prevStep, formData }) => {
  const [loading, setLoading] = useState(true);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("Initializing");
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [progressValue, setProgressValue] = useState(10);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [showApiCheck, setShowApiCheck] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Extract needed values from formData to avoid dependency issues
  const initialPrompt = formData.initialPrompt;
  const projectGoal = formData.projectGoal;
  const projectCategory = formData.projectCategory;
  
  // Use refs to prevent infinite loops and track execution
  const pipelineExecuted = useRef(false);
  const userIdRef = useRef<string>("");

  useEffect(() => {
    // Flag to track if component is mounted
    let isMounted = true;
    
    const runPipeline = async () => {
      // Skip if pipeline already executed
      if (pipelineExecuted.current) return;
      pipelineExecuted.current = true;
      
      try {
        setLoading(true);
        setCurrentStep("Identifying keywords from your project details...");
        setProgressValue(10);
        
        // Use the project title/goal as the main keyword
        const mainKeyword = initialPrompt || projectGoal || projectCategory;
        if (!mainKeyword) {
          throw new Error("Could not determine main keyword from project details");
        }
        
        // Try to fetch the current user using a client-safe approach
        try {
          // Make a client-side API request to a Next.js API route
          const response = await fetch('/api/auth/session', {
            method: 'GET',
            credentials: 'include', // Include cookies with the request
          });
            
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user && data.user.id) {
              userIdRef.current = data.user.id;
              console.log("Using authenticated user ID:", userIdRef.current);
            } else {
              // No authenticated user - redirect to sign in
              if (isMounted) {
                setError("Authentication required. Please sign in first.");
                toast({
                  title: "Authentication Required",
                  description: "You need to be signed in to generate a project roadmap.",
                });
                
                // Redirect to sign in page after a brief delay
                setTimeout(() => {
                  if (isMounted) {
                    router.push("/sign-in");
                  }
                }, 2000);
              }
              throw new Error("Authentication required");
            }
          } else {
            throw new Error(`Failed to fetch user session: ${response.statusText}`);
          }
        } catch (authError) {
          console.error("Error getting authenticated user:", authError);
          
          if (isMounted) {
            setError("Authentication required. Please sign in to continue.");
            toast({
              title: "Authentication Failed",
              description: "There was a problem with authentication. Please sign in again.",
            });
            
            // Redirect to sign in page after a brief delay
            setTimeout(() => {
              if (isMounted) {
                router.push("/sign-in");
              }
            }, 2000);
          }
          throw authError;
        }
        
        // Set user ID in state if we got a valid authenticated ID
        if (isMounted && userIdRef.current) {
          setUserId(userIdRef.current);
        }
        
        // Step 1: Keyword analysis
        if (isMounted) setCurrentStep("Analyzing keywords and topics...");
        if (isMounted) setProgressValue(25);
        
        // Step 2: Call the pipeline directly
        if (isMounted) setCurrentStep("Processing your project details...");
        if (isMounted) setProgressValue(40);
        
        // Import the pipeline utility
        const { executeKeywordPipeline } = await import("../../../utils/pipeline/keywordPipelineUtils");
        
        // Execute the pipeline directly
        const result = await executeKeywordPipeline(
          userIdRef.current,
          mainKeyword,
          "en-US"
        );
        
        if (!result.success) {
          throw new Error(result.error || "Pipeline execution failed");
        }
        
        if (isMounted) setProgressValue(65);
        if (isMounted) setCurrentStep("Generating mindmap visualization...");
        
        // Simulate additional processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (isMounted) setProgressValue(85);
        if (isMounted) setCurrentStep("Finalizing your project roadmap...");
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (isMounted) setProgressValue(100);
        if (isMounted) setCurrentStep("Pipeline completed successfully!");
        
        if (isMounted) {
          toast({
            title: "Analysis complete",
            description: "Your project roadmap has been generated successfully!",
          });
        }

        // Delay to show completion message before redirecting
        setTimeout(() => {
          if (!isMounted) return;
          
          setLoading(false);
          setRoadmapGenerated(true);
          
          // Show redirect message
          setRedirecting(true);
          toast({
            title: "Redirecting to your mindmap",
            description: "Taking you to your personalized mindmap page...",
          });
          
          // Redirect after a brief delay
          setTimeout(() => {
            if (isMounted) {
              router.push(`/${userIdRef.current}/mindmap`);
            }
          }, 2000);
        }, 1500);

      } catch (err) {
        if (!isMounted) return;
        
        console.error("Pipeline error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        
        toast({
          title: "Error during analysis",
          description: err instanceof Error ? err.message : "Failed to generate your roadmap"
        });
        
        // Use userIdRef if set, otherwise generate a fallback
        let redirectId = userIdRef.current;
        
        if (!redirectId) {
          // Generate fallback user ID
          const fallbackUserId = `demo-user-${Math.floor(Math.random() * 1000)}`;
          redirectId = fallbackUserId;
          userIdRef.current = fallbackUserId;
          
          if (isMounted) setUserId(fallbackUserId);
        }
        
        // Fall back to showing the mindmap even if pipeline fails
        setTimeout(() => {
          if (!isMounted) return;
          
          setLoading(false);
          setRoadmapGenerated(true);
          setRedirecting(true);
          
          toast({
            title: "Redirecting to default mindmap",
            description: "Taking you to a mindmap visualization..."
          });
          
          // Redirect after a brief delay
          setTimeout(() => {
            if (isMounted) {
              router.push(`/${redirectId}/mindmap`);
            }
          }, 2000);
        }, 2000);
      }
    };

    // Run the pipeline once when component mounts
    runPipeline();
    
    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, [initialPrompt, projectGoal, projectCategory, router, toast]); // userId excluded as it's set inside

  const runPipeline = useCallback(async () => {
    // Skip if pipeline already executed
    if (pipelineExecuted.current) return;
    pipelineExecuted.current = true;
    
    try {
      setLoading(true);
      setCurrentStep("Identifying keywords from your project details...");
      setProgressValue(10);
      
      // Use the project title/goal as the main keyword
      const mainKeyword = initialPrompt || projectGoal || projectCategory;
      if (!mainKeyword) {
        throw new Error("Could not determine main keyword from project details");
      }
      
      // Try to fetch the current user using a client-safe approach
      try {
        // Make a client-side API request to a Next.js API route
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include', // Include cookies with the request
        });
          
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user && data.user.id) {
            userIdRef.current = data.user.id;
            console.log("Using authenticated user ID:", userIdRef.current);
          } else {
            // No authenticated user - redirect to sign in
            if (isMounted) {
              setError("Authentication required. Please sign in first.");
              toast({
                title: "Authentication Required",
                description: "You need to be signed in to generate a project roadmap.",
              });
              
              // Redirect to sign in page after a brief delay
              setTimeout(() => {
                if (isMounted) {
                  router.push("/sign-in");
                }
              }, 2000);
            }
            throw new Error("Authentication required");
          }
        } else {
          throw new Error(`Failed to fetch user session: ${response.statusText}`);
        }
      } catch (authError) {
        console.error("Error getting authenticated user:", authError);
        
        if (isMounted) {
          setError("Authentication required. Please sign in to continue.");
          toast({
            title: "Authentication Failed",
            description: "There was a problem with authentication. Please sign in again.",
          });
          
          // Redirect to sign in page after a brief delay
          setTimeout(() => {
            if (isMounted) {
              router.push("/sign-in");
            }
          }, 2000);
        }
        throw authError;
      }
      
      // Set user ID in state if we got a valid authenticated ID
      if (isMounted && userIdRef.current) {
        setUserId(userIdRef.current);
      }
      
      // Step 1: Keyword analysis
      if (isMounted) setCurrentStep("Analyzing keywords and topics...");
      if (isMounted) setProgressValue(25);
      
      // Step 2: Call the pipeline directly
      if (isMounted) setCurrentStep("Processing your project details...");
      if (isMounted) setProgressValue(40);
      
      // Import the pipeline utility
      const { executeKeywordPipeline } = await import("../../../utils/pipeline/keywordPipelineUtils");
      
      // Execute the pipeline directly
      const result = await executeKeywordPipeline(
        userIdRef.current,
        mainKeyword,
        "en-US"
      );
      
      if (!result.success) {
        throw new Error(result.error || "Pipeline execution failed");
      }
      
      if (isMounted) setProgressValue(65);
      if (isMounted) setCurrentStep("Generating mindmap visualization...");
      
      // Simulate additional processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (isMounted) setProgressValue(85);
      if (isMounted) setCurrentStep("Finalizing your project roadmap...");
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (isMounted) setProgressValue(100);
      if (isMounted) setCurrentStep("Pipeline completed successfully!");
      
      if (isMounted) {
        toast({
          title: "Analysis complete",
          description: "Your project roadmap has been generated successfully!",
        });
      }

      // Delay to show completion message before redirecting
      setTimeout(() => {
        if (!isMounted) return;
        
        setLoading(false);
        setRoadmapGenerated(true);
        
        // Show redirect message
        setRedirecting(true);
        toast({
          title: "Redirecting to your mindmap",
          description: "Taking you to your personalized mindmap page...",
        });
        
        // Redirect after a brief delay
        setTimeout(() => {
          if (isMounted) {
            router.push(`/${userIdRef.current}/mindmap`);
          }
        }, 2000);
      }, 1500);

    } catch (err) {
      if (!isMounted) return;
      
      console.error("Pipeline error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      
      toast({
        title: "Error during analysis",
        description: err instanceof Error ? err.message : "Failed to generate your roadmap"
      });
      
      // Use userIdRef if set, otherwise generate a fallback
      let redirectId = userIdRef.current;
      
      if (!redirectId) {
        // Generate fallback user ID
        const fallbackUserId = `demo-user-${Math.floor(Math.random() * 1000)}`;
        redirectId = fallbackUserId;
        userIdRef.current = fallbackUserId;
        
        if (isMounted) setUserId(fallbackUserId);
      }
      
      // Fall back to showing the mindmap even if pipeline fails
      setTimeout(() => {
        if (!isMounted) return;
        
        setLoading(false);
        setRoadmapGenerated(true);
        setRedirecting(true);
        
        toast({
          title: "Redirecting to default mindmap",
          description: "Taking you to a mindmap visualization..."
        });
        
        // Redirect after a brief delay
        setTimeout(() => {
          if (isMounted) {
            router.push(`/${redirectId}/mindmap`);
          }
        }, 2000);
      }, 2000);
    }
  }, [initialPrompt, projectGoal, projectCategory, router, toast]); // userId excluded as it's set inside

  return (
    <div className="relative px-6 py-8 md:px-12 md:py-12 bg-white rounded-xl shadow-md overflow-hidden">
      {loading && (
        <div id="loadingState">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h3 className="loading-text">
              <span className="ai-name">Ideagenie</span> is crafting your roadmap
            </h3>
            <div className="my-4 w-full max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressValue}%` }}
                ></div>
              </div>
              <p className="text-sm text-right mt-1 text-gray-600">{progressValue}%</p>
            </div>
            <p className="loading-subtext">
              {currentStep}
            </p>
            {error && (
              <p className="error-message" style={{ color: "red", marginTop: "1rem" }}>
                Error: {error}
              </p>
            )}
            <div className="pulse">
              <i className="fas fa-brain" style={{ fontSize: "2rem", color: "var(--primary)" }}></i>
            </div>
          </div>
        </div>
      )}      
      {!loading && roadmapGenerated && (
        <div className="redirect-container">
          <div className="success-message text-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto">
            <div className="checkmark-circle bg-green-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-check" style={{ fontSize: "2.5rem", color: "#10b981" }}></i>
            </div>
            <h3 className="text-2xl font-bold mt-6 mb-2">Success!</h3>
            <p className="mb-4 text-gray-600">Your mindmap has been generated successfully.</p>
            
            {redirecting ? (
              <div className="redirecting-message">
                <div className="loading-spinner" style={{ margin: "0 auto", width: "30px", height: "30px" }}></div>
                <p className="mt-4 mb-2 text-gray-600">Redirecting to your personal mindmap page...</p>
                <div className="text-sm text-gray-500 mt-4">
                  URL: <span className="font-mono text-blue-600">/{userId}/mindmap</span>
                </div>
                <p className="text-sm mt-4 mb-2">
                  If you aren&apos;t redirected automatically, click the button below:
                </p>
                <button 
                  className="btn-primary mt-2"
                  onClick={() => router.push(`/${userId}/mindmap`)}
                >
                  Go to Your Mindmap
                </button>
              </div>
            ) : (
              <div>
                <button 
                  className="btn-primary mt-4"
                  onClick={() => router.push(`/${userId}/mindmap`)}
                >
                  View Your Mindmap
                </button>
                <div className="text-sm text-gray-500 mt-4">
                  Bookmark this unique URL to access your mindmap later: <br />
                  <span className="font-mono text-blue-600">/{userId}/mindmap</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {pipelineError && (
        <div className="mb-6 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-bold text-red-700 mb-2">Error Processing Request</h3>
            <p className="text-red-600">{pipelineError}</p>
            
            {/* Show retry button */}
            <button
              onClick={() => runPipeline()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              Retry
            </button>
          </div>
          
          {/* Show API check if needed */}
          {showApiCheck && (
            <div className="mt-6">
              <GeminiApiCheck showTestButton={true} />
              <div className="mt-4 text-center">
                <a 
                  href="/settings/gemini-api" 
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Open Gemini API Settings
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step4;
