"use client";

/**
 * Smooth Scroll Utility for IdeaGenie
 * 
 * This script enhances the native scroll-behavior: smooth with JS for better control
 * and smoother transitions, especially for browsers that don't fully support CSS scroll behavior.
 * 
 * Features:
 * - Smooth anchor link scrolling with customizable easing
 * - Scroll direction detection
 * - Optimized scroll performance with throttling
 * - Smooth return-to-position after page reload
 * - Momentum-based scrolling simulation
 */

// Throttle function to limit how often a function can run
function throttle(callback, delay = 16) {
  let isThrottled = false;
  let savedArgs = null;

  function wrapper(...args) {
    if (isThrottled) {
      savedArgs = args;
      return;
    }

    callback(...args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper(...savedArgs);
        savedArgs = null;
      }
    }, delay);
  }

  return wrapper;
}

export function initSmoothScroll(options = {}) {
  if (typeof window === 'undefined') return;
  
  const settings = {
    duration: 1000,
    offset: 0,
    easing: 'cubic',
    saveScrollPosition: true,
    ...options
  };
  
  // Check if native smooth scrolling is supported
  const canSmoothScroll = 'scrollBehavior' in document.documentElement.style;
  
  // Store scroll position for detecting direction
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollTimeout;
  let isScrolling = false;
  let scrollSpeed = 0;
  let lastScrollEvent = Date.now();
  
  // Add a class to the body to indicate smooth scrolling is active
  document.body.classList.add('smooth-scroll-enabled');
  
  // Save scroll position in sessionStorage when navigating to another page
  if (settings.saveScrollPosition) {
    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };
    
    // Save position before navigating away
    window.addEventListener('beforeunload', saveScrollPosition);
    
    // Save on clicks to links that aren't anchor links
    document.addEventListener('click', (e) => {
      if (e.target && e.target.tagName === 'A' && !e.target.getAttribute('href')?.startsWith('#')) {
        saveScrollPosition();
      }
    });
    
    // Restore position on page load
    if (sessionStorage.getItem('scrollPosition')) {
      const savedPosition = parseInt(sessionStorage.getItem('scrollPosition'));
      if (!isNaN(savedPosition)) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.scrollTo({
              top: savedPosition,
              behavior: 'instant'
            });
          }, 0);
        });
      }
    }
  }
  
  // Handle scroll events with better performance
  const handleScroll = throttle(() => {
    if (isScrolling) return;
    
    isScrolling = true;
    
    // Calculate scroll speed
    const now = Date.now();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const timeDiff = now - lastScrollEvent;
    
    if (timeDiff > 0) {
      scrollSpeed = Math.abs(scrollTop - lastScrollTop) / timeDiff * 1000; // pixels per second
    }
    
    lastScrollEvent = now;
    
    // Use requestAnimationFrame for smooth rendering
    window.requestAnimationFrame(() => {
      // Add body classes based on scroll direction and speed
      const scrollingDown = scrollTop > lastScrollTop;
      document.body.classList.toggle('is-scrolling-down', scrollingDown);
      document.body.classList.toggle('is-scrolling-up', !scrollingDown);
      
      // Add classes based on scroll speed
      document.body.classList.toggle('is-scrolling-fast', scrollSpeed > 1000);
      document.body.classList.toggle('is-scrolling-slow', scrollSpeed <= 1000);
      
      // Update position for next event
      lastScrollTop = scrollTop;
      isScrolling = false;
    });
    
    // Handle scroll end
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.classList.remove(
        'is-scrolling-down', 
        'is-scrolling-up',
        'is-scrolling-fast',
        'is-scrolling-slow'
      );
      document.body.classList.add('scroll-stopped');
      
      // Remove the class after animation completes
      setTimeout(() => {
        document.body.classList.remove('scroll-stopped');
      }, 300);
    }, 150);
  }, 10);
  
  // Easing functions
  const easings = {
    linear: t => t,
    quad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    cubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    elastic: t => {
      const p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    }
  };
  
  // Enable smooth anchor links
  const enableSmoothAnchorLinks = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        e.preventDefault();
        
        // Check if native smooth scrolling is supported
        if (canSmoothScroll) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          // Enhanced smooth scrolling for browsers that don't support it
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - settings.offset;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          const duration = settings.duration; // ms
          let start = null;
          
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Get the easing function
            const easingFn = easings[settings.easing] || easings.cubic;
            
            window.scrollTo(0, startPosition + distance * easingFn(percentage));
            
            if (progress < duration) {
              window.requestAnimationFrame(step);
            }
          };
          
          window.requestAnimationFrame(step);
        }
      });
    });
  };
  
  // Add scroll direction observer
  const addScrollObserver = () => {
    // Find elements that should animate on scroll
    const animatedElements = document.querySelectorAll('[data-scroll]');
    
    // Set up IntersectionObserver
    if (animatedElements.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Optionally stop observing after animation
            if (entry.target.dataset.once === 'true') {
              observer.unobserve(entry.target);
            }
          } else {
            if (entry.target.dataset.once !== 'true') {
              entry.target.classList.remove('in-view');
            }
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      });
      
      animatedElements.forEach(el => {
        observer.observe(el);
      });
    }
  };
  
  // Optimize elements with fixed positioning during scroll
  const optimizeFixedElements = () => {
    const fixedElements = document.querySelectorAll('.fixed, .sticky');
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          fixedElements.forEach(el => {
            // Apply performance optimizations during scroll
            el.style.willChange = 'transform';
          });
          
          clearTimeout(ticking);
          ticking = setTimeout(() => {
            fixedElements.forEach(el => {
              // Remove optimization when scrolling stops
              el.style.willChange = 'auto';
            });
            ticking = false;
          }, 200);
        });
        ticking = true;
      }
    }, { passive: true });
  };
  
  // Add event listener for scroll
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initialize
  if (document.readyState === 'complete') {
    enableSmoothAnchorLinks();
    addScrollObserver();
    optimizeFixedElements();
  } else {
    window.addEventListener('load', () => {
      enableSmoothAnchorLinks();
      addScrollObserver();
      optimizeFixedElements();
    });
  }
  
  // Return methods that can be used outside
  return {
    scrollTo: (selector, options = {}) => {
      const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!element) return;
      
      const mergedOptions = {
        offset: settings.offset,
        duration: settings.duration,
        easing: settings.easing,
        ...options
      };
      
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - mergedOptions.offset;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      let startTime = null;
      
      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / mergedOptions.duration, 1);
        const easingFn = easings[mergedOptions.easing] || easings.cubic;
        
        window.scrollTo(0, startPosition + distance * easingFn(progress));
        
        if (timeElapsed < mergedOptions.duration) {
          requestAnimationFrame(animation);
        }
      }
      
      requestAnimationFrame(animation);
    }
  };
}
