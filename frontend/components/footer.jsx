"use client";

import Link from "next/link";
import { Settings, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} IdeaGenie AI Project Generator
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link 
              href="/settings/gemini-api" 
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <Settings size={14} />
              <span>Gemini API Settings</span>
            </Link>
            
            <a 
              href="https://github.com/yourusername/IdeaGenie" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>
            
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Heart size={14} className="text-red-500" />
              <span>Made with AI</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
