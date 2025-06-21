import React from "react";
import { validateStep } from "./formHelpers";

type Step1Props = {
  initialPrompt: string;
  setInitialPrompt: (value: string) => void;
  nextStep: () => void;
};

const Step1: React.FC<Step1Props> = ({ initialPrompt, setInitialPrompt, nextStep }) => {
  const handleContinue = () => {
    if (validateStep(1, { initialPrompt })) {
      nextStep();
    }
  };

  return (
    <div className="step-content active" id="step1">
      <h1 className="step-title">Start Your Project</h1>
      <div className="form-group">
        <label className="form-label">What's your project idea?</label>
        <textarea
          className="form-control"
          id="initialPrompt"
          rows={4}
          placeholder="Describe your initial idea or prompt..."
          value={initialPrompt}
          onChange={(e) => setInitialPrompt(e.target.value)}
        />
      </div>
      <div className="navigation">
        <div></div>
        <button className="btn btn-primary" onClick={handleContinue}>
          Continue <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step1;
