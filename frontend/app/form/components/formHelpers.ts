// Utilities for the form
export interface FormData {
  initialPrompt: string;
  productType: string;
  projectGoal: string;
  projectCategory: string;
  teamName: string;
  memberCount: number;
  teamMembers: TeamMember[];
}

export interface TeamMember {
  id: number;
  name: string;
  skills: string;
  role: string;
}

export function validateStep(step: number, formData: Partial<FormData>): boolean {
  if (step === 1 && !formData.initialPrompt?.trim()) {
    alert('Please describe your project idea before continuing');
    return false;
  }
  
  if (step === 2 && !formData.projectGoal?.trim()) {
    alert('Please enter your project goal before continuing');
    return false;
  }
  
  return true;
}

export function generateMembersArray(count: number): TeamMember[] {
  const members: TeamMember[] = [];
  for (let i = 1; i <= count; i++) {
    members.push({
      id: i,
      name: '',
      skills: '',
      role: ''
    });
  }
  return members;
}

export function downloadRoadmap() {
  // In a real implementation, this would generate a PDF or document
  alert('Roadmap downloaded successfully!');
}

export const CATEGORIES = [
  { value: "", label: "Select a category" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "agriculture", label: "Agriculture" },
  { value: "business", label: "Business" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

export const PRODUCT_TYPES = [
  { id: "digital", label: "Digital Product", icon: "laptop-code" },
  { id: "physical", label: "Physical Product", icon: "box-open" },
  { id: "other", label: "Other", icon: "question-circle" },
];
