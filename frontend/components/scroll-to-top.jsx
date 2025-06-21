'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from './ui/button';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 500px down
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);
    
    // Clean up the event listener on component unmount
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    // Use the global function if available (from smoothScroll.js)
    if (window.smoothScrollTo) {
      window.smoothScrollTo('body', { offset: 0, duration: 800 });
    } else {
      // Fallback
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <Button
        onClick={scrollToTop}
        size="icon"
        className="bg-primary/90 hover:bg-primary shadow-lg rounded-full h-12 w-12 flex items-center justify-center render-optimized"
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
        <span className="sr-only">Scroll to top</span>
      </Button>
    </div>
  );
}
