"use client";

import React from "react";

/**
 * MetallicHeading Component - Consistent section title with gradient effect
 * 
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Text content of the heading
 * @param {string} props.className - Additional CSS classes
 */
const MetallicHeading = ({ children, className = "" }) => {
  return (
    <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-center gradient-text ${className}`}>
      {children}
    </h2>
  );
};

export default MetallicHeading;
