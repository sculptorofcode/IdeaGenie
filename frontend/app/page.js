"use client";

import React, { useRef } from "react";
import { useUser } from "@civic/auth/react";
import HeroSection from "../components/hero";
import HowItWorksSection from "./(main)/_components/HowItWorksSection";
import FeaturesSection from "./(main)/_components/FeaturesSection";
import StatsSection from "./(main)/_components/StatsSection";
import FaqSection from "./(main)/_components/FaqSection";
import CtaSection from "./(main)/_components/CtaSection";

export default function Home() {
  const { user, isLoaded } = useUser();
  const testimonialRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const statsRef = useRef(null);
  const faqsRef = useRef(null);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <HeroSection />
      </section>

      {/* How It Works Section */}
      <div ref={howItWorksRef}>
        <HowItWorksSection />
      </div>

      {/* Features Section */}
      <div ref={featuresRef}>
        <FeaturesSection />
      </div>

      {/* Stats Section */}
      <div ref={statsRef}>
        <StatsSection />
      </div>

      {/* FAQ Section */}
      <div ref={faqsRef}>
        <FaqSection />
      </div>

      {/* CTA Section */}
      <CtaSection />
    </div>
  );
}
