'use client';

import { useEffect } from 'react';
import { initSmoothScroll } from '../lib/smoothScroll';

/**
 * Component that initializes smooth scrolling behavior
 * Separated as a client component to prevent hydration issues
 */
export default function SmoothScrollInit() {
  useEffect(() => {
    // Initialize smooth scrolling with options
    const smoothScroll = initSmoothScroll({
      duration: 800,
      offset: 60, // Account for fixed header
      easing: 'cubic',
      saveScrollPosition: true
    });
    
    // Optional: Make the scrollTo function available globally
    window.smoothScrollTo = smoothScroll.scrollTo;
    
    // Clean up on unmount
    return () => {
      window.smoothScrollTo = undefined;
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}
