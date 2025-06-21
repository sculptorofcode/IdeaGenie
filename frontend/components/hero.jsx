"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link"; 
import { useUser } from "@civic/auth/react";

const HeroSection = () => {
  const imageRef = useRef(null);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { user, signIn } = useUser();
  const fullText = "IDEAGENIE";

  useEffect(() => {
    setIsMounted(true);
  });

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const typingTimer = setTimeout(() => {
        setDisplayText((prevText) => prevText + fullText[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 100); // Adjust typing speed here (milliseconds)

      return () => clearTimeout(typingTimer);
    }
  }, [currentIndex, fullText]);

  const handleButtonClick = () => {
    setIsClicked(true);
    if (!user) {
      signIn();
    }
  };

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-7xl gradient-title animate-gradient">
            {displayText}
            <span className="typing-cursor">|</span>
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Ignite innovation with smart team collaboration and AI-powered
            project ideas
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          {user ? (
            <Link href="/form">
              <Button 
                size="lg" 
                className="px-8 hover:bg-black hover:text-white transition-colors duration-200"
                onClick={() => setIsClicked(true)}
              >
                Get Started
              </Button>
            </Link>
          ) : (
            <div
              className={`transition-all duration-300 delay-300 ${
                isMounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
            >
              <Button 
                size="lg" 
                className={`px-8 ${isClicked ? 'bg-black text-white' : ''} hover:bg-black hover:text-white transition-colors duration-200`}
                onClick={handleButtonClick}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image relative inline-block">
            {/* Glossy border element */}
            <div className="absolute inset-0 rounded-lg glossy-border overflow-hidden pointer-events-none"></div>
            <Image
              src="/banner.jpg"
              width={1100}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border border-transparent relative z-10"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;