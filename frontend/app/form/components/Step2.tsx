import React from "react";
import { CATEGORIES, PRODUCT_TYPES, validateStep } from "./formHelpers";

type Step2Props = {
  productType: string;
  setProductType: (value: string) => void;
  projectGoal: string;
  setProjectGoal: (value: string) => void;
  projectCategory: string;
  setProjectCategory: (value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const Step2: React.FC<Step2Props> = ({
  productType,
  setProductType,
  projectGoal,
  setProjectGoal,
  projectCategory,
  setProjectCategory,
  nextStep,
  prevStep,
}) => {
  const handleContinue = () => {
    if (validateStep(2, { projectGoal })) {
      nextStep();
    }
  };

  return (
    <div className="step-content active" id="step2">
      <h1 className="step-title">Product Details</h1>      <div className="form-group">
        <label className="form-label">Product Type</label>
        <div className="radio-group radio-group-responsive">
          {PRODUCT_TYPES.map((type) => (
            <div className="radio-option" key={type.id}>
              <input
                type="radio"
                name="product-type"
                id={type.id}
                value={type.id}
                checked={productType === type.id}
                onChange={() => setProductType(type.id)}
              />
              <label className="radio-label" htmlFor={type.id}>
                <i className={`fas fa-${type.icon} radio-icon`}></i>
                <span className="radio-text">{type.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Project Goal</label>
        <input
          type="text"
          className="form-control"
          id="projectGoal"
          placeholder="What are you trying to achieve?"
          value={projectGoal}
          onChange={(e) => setProjectGoal(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Field/Category</label>
        <select
          className="form-control"
          id="projectCategory"
          value={projectCategory}
          onChange={(e) => setProjectCategory(e.target.value)}
        >
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <div className="navigation">
        <button className="btn btn-outline" onClick={prevStep}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button className="btn btn-primary" onClick={handleContinue}>
          Continue <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step2;
