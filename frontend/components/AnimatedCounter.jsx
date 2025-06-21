"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const observerRef = useRef(null);

  const startCounting = useCallback(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      const currentCount = Math.floor(progress * target);

      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCount);
  }, [duration, target]);

  useEffect(() => {
    if (!observerRef.current && ref.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startCounting();
            observerRef.current.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(ref.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [startCounting]);

  return <span ref={ref}>{count}+</span>;
};

export default AnimatedCounter;
