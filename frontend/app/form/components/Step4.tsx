import React, { useEffect, useState } from "react";
import { downloadRoadmap } from "./formHelpers";
import MindMapScene from "../../../components/mindmap/MindMapScene";
import { useToast } from "../../../hooks/use-toast"; // Import toast for notifications
import { PipelineProvider } from "../../../components/PipelineContext";
import { useRouter } from "next/navigation";

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
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Run the keyword pipeline based on the user's project details
    const runPipeline = async () => {
      try {
        setLoading(true);
        setCurrentStep("Identifying keywords from your project details...");
        setProgressValue(10);

        // Use the project title/goal as the main keyword
        const mainKeyword = formData.initialPrompt || formData.projectGoal || formData.projectCategory;
        if (!mainKeyword) {
          throw new Error("Could not determine main keyword from project details");
        }

        // Generate a unique user ID with timestamp to avoid collisions
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 10000);
        const generatedUserId = `user-${timestamp}-${randomNum}`;
        setUserId(generatedUserId);
        
        // Step 1: Keyword analysis
        setCurrentStep("Analyzing keywords and topics...");
        setProgressValue(25);
        
        // Step 2: Call the pipeline directly instead of using an API route
        setCurrentStep("Processing your project details...");
        setProgressValue(40);
        
        // Import the pipeline utility
        const { executeKeywordPipeline } = await import("../../../utils/pipeline/keywordPipelineUtils");
        
        // Execute the pipeline directly
        const result = await executeKeywordPipeline(
          generatedUserId,
          mainKeyword,
          "en-US"
        );
        
        if (!result.success) {
          throw new Error(result.error || "Pipeline execution failed");
        }
        setProgressValue(65);
        setCurrentStep("Generating mindmap visualization...");
        
        // Simulate additional processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProgressValue(85);
        setCurrentStep("Finalizing your project roadmap...");
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgressValue(100);
        setCurrentStep("Pipeline completed successfully!");
        
        toast({
          title: "Analysis complete",
          description: "Your project roadmap has been generated successfully!",
        });

        // Short delay to show completion message before redirecting
        setTimeout(() => {
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
            router.push(`/${generatedUserId}/mindmap`);
          }, 2000);
        }, 1500);

      } catch (err) {
        console.error("Pipeline error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast({
          title: "Error during analysis",
          description: err instanceof Error ? err.message : "Failed to generate your roadmap"
        });
        
        // Generate a fallback user ID if error occurs and we don't have one
        if (!userId) {
          const fallbackUserId = `demo-user-${Math.floor(Math.random() * 1000)}`;
          setUserId(fallbackUserId);
        }
        
        // Fall back to showing the mindmap even if the pipeline fails
        setTimeout(() => {
          setLoading(false);
          setRoadmapGenerated(true);
          
          // Show redirect message
          setRedirecting(true);
          toast({
            title: "Redirecting to default mindmap",
            description: "Taking you to a mindmap visualization..."
          });
          
          // Redirect after a brief delay
          setTimeout(() => {
            router.push(`/${userId}/mindmap`);
          }, 2000);
        }, 2000);
      }
    };

    runPipeline();
  }, [formData, toast, router, userId]);

  return (
    <div className="step-content active" id="step4">
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
    </div>
  );
};

export default Step4;