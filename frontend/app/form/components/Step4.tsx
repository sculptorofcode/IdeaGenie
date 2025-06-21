import React, { useEffect, useState } from "react";
import { downloadRoadmap } from "./formHelpers";
import MindMapScene from "../../../components/mindmap/MindMapScene";

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

  useEffect(() => {
    // Simulate AI processing with a delay
    const timer = setTimeout(() => {
      setLoading(false);
      setRoadmapGenerated(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="step-content active" id="step4">
      {loading && (
        <div id="loadingState">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h3 className="loading-text">
              <span className="ai-name">Ideagenie</span> is crafting your roadmap
            </h3>
            <p className="loading-subtext">
              Analyzing your project requirements and team composition...
            </p>
            <div className="pulse">
              <i className="fas fa-brain" style={{ fontSize: "2rem", color: "var(--primary)" }}></i>
            </div>
          </div>
        </div>
      )}      
      {!loading && roadmapGenerated && (
        <MindMapScene />
      )}
    </div>
  );
};

export default Step4;