"use client";

import React from "react";
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

export default function HowItWorksSection() {
  return (
    <section 
      className="py-20 bg-background" 
      id="how-it-works"
      data-scroll
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our intelligent system streamlines your path from idea to fully
            realized application, making innovation accessible to everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {howItWorks.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="scrollable-container"
            >
              <Card className="border border-primary/20 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-full glass-card render-optimized">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${step.bgColor} text-background`}>
                    {step.icon}
                  </div>
                  
                  <div className="text-xs font-semibold mb-2 inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 w-fit">
                    Step {index + 1}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground flex-grow">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
