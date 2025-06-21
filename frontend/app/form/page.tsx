"use client";
import React, { useEffect, useState } from "react";
import { generateMembersArray, TeamMember } from "./components/formHelpers";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Image from "next/image";
import "./assets/styles.css";
import "./assets/responsive.css";

export default function Home() {
  const [step, setStep] = useState(1);
  const [initialPrompt, setInitialPrompt] = useState("");
  const [productType, setProductType] = useState("digital");
  const [projectGoal, setProjectGoal] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<number | "">(3);
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (members.length === 0 && typeof teamMembers === "number") {
      setMembers(generateMembersArray(teamMembers));
    }
  }, [teamMembers, members.length]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const getStepClass = (stepNum: number) => {
    if (stepNum === step) return "step active";
    if (stepNum < step) return "step completed";
    return "step";
  };

  const formData = {
    initialPrompt,
    productType,
    projectGoal,
    projectCategory,
    teamName,
    members,
  };

  return (
    <>
      <div className="container !pt-24">

        <div className="step-container">
          <div className="step-progress">
            <div className={getStepClass(1)} data-step="1">
              <div className="step-number">1</div>
              <div className="step-label">Initial Prompt</div>
            </div>
            <div className={getStepClass(2)} data-step="2">
              <div className="step-number">2</div>
              <div className="step-label">Product Details</div>
            </div>
            <div className={getStepClass(3)} data-step="3">
              <div className="step-number">3</div>
              <div className="step-label">Team Setup</div>
            </div>
            <div className={getStepClass(4)} data-step="4">
              <div className="step-number">4</div>
              <div className="step-label">AI Roadmap</div>
            </div>
          </div>

          {step === 1 && (
            <Step1
              initialPrompt={initialPrompt}
              setInitialPrompt={setInitialPrompt}
              nextStep={nextStep}
            />
          )}
          {step === 2 && (
            <Step2
              productType={productType}
              setProductType={setProductType}
              projectGoal={projectGoal}
              setProjectGoal={setProjectGoal}
              projectCategory={projectCategory}
              setProjectCategory={setProjectCategory}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 3 && (
            <Step3
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
              teamName={teamName}
              setTeamName={setTeamName}
              members={members}
              setMembers={setMembers}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 4 && <Step4 prevStep={prevStep} formData={formData} />}
        </div>
      </div>
    </>
  );
}