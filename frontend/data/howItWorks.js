import { motion } from "framer-motion";
import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const howItWorks = [
  {
    title: "Team Registration & Skill Mapping",
    description: "Create or join a team and enter each member's skills and GitHub profile. IdeaGenie automatically maps the team’s combined strengths using AI",
    icon: <UserPlus className="w-8 h-8" />,
    bgClass: "bg-gradient-to-br from-gray-900 to-gray-800",
    hoverClass: "hover:shadow-purple-500/30",
    borderClass: "border-purple-500/20"
  },
  {
    title: "Problem Discovery from the Web",
    description: "Our system scrapes real-world technical issues from forums like Reddit, Stack Overflow, and GitHub. Gemini AI detects emotion, urgency, and relevance in each problem.",
    icon: <FileEdit className="w-8 h-8" />,
    bgClass: "bg-gradient-to-br from-gray-900 to-gray-800",
    hoverClass: "hover:shadow-blue-500/30",
    borderClass: "border-blue-500/20"
  },
  {
    title: "AI-Powered Idea Generation",
    description: "Based on your team’s skills and selected problems, Gemini AI suggests personalized project ideas with full structure — including features, tools, and use cases.",
    icon: <Users className="w-8 h-8" />,
    bgClass: "bg-gradient-to-br from-gray-900 to-gray-800",
    hoverClass: "hover:shadow-emerald-500/30",
    borderClass: "border-emerald-500/20"
  },
  {
    title: "Track, Customize & Export",
    description: "Choose your favorite idea, assign team roles, and track progress. Export your idea in Markdown or PDF format for hackathons or team planning.",
    icon: <LineChart className="w-8 h-8" />,
    bgClass: "bg-gradient-to-br from-gray-900 to-gray-800",
    hoverClass: "hover:shadow-amber-500/30",
    borderClass: "border-amber-500/20"
  },
];