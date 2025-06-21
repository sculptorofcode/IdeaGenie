"use client";

import DashboardView from "./_component/dashboard-view";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { isOnboarded } = await getUserOnboardingStatus();
        
        if (!isOnboarded) {
          redirect("/onboarding");
        }
        
        const insightsData = await getIndustryInsights();
        setInsights(insightsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserStatus();
  }, []);
  return (
    <div className="container mx-auto">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-lg">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <DashboardView insights={insights} />
      )}
    </div>
  );
}
