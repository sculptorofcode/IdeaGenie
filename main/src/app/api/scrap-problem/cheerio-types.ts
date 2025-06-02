// This file adds type definitions for Cheerio to avoid TypeScript errors
import * as cheerio from "cheerio";

// Re-export cheerio for use in route.ts
export { cheerio };

// Define problem type
export interface Problem {
  title: string;
  description: string;
  url: string;
  tags: string[];
  source: string;
  emotion: string;
  rating: number;
  difficulty: string;
  urgency: number;
  popularity: number;
  novelty: number;
  feasibility: number;
  impact_scope: number;
}

// Define source config type
export interface SourceConfig {
  url: string;
}
