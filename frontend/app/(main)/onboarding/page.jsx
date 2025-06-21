"use client";

import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { isOnboarded } = await getUserOnboardingStatus();
        
        if (isOnboarded) {
          redirect("/dashboard");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserStatus();
  }, []);
  return (
    <main>
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-lg">Loading...</p>
          </div>
        </div>
      ) : (
        <OnboardingForm industries={industries} />
      )}
    </main>
  );
}
