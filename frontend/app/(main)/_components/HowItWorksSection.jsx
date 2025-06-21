"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, FileEdit, Users, LineChart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export const howItWorks = [
  {
    title: "Team Registration & Skill Mapping",
    description:
      "Create or join a team and enter each member's skills and GitHub profile. IdeaGenie automatically maps the team's combined strengths using AI",
    icon: <UserPlus className="w-8 h-8" />,
    bgColor: "bg-primary/10",
    hoverClass: "hover:shadow-primary/30",
    borderClass: "border-primary/20",
    color: "text-primary",
    learnMoreLink: "/form",
    details: [
      "Automated skill detection from GitHub profiles",
      "Visual skill mapping interface",
      "Team strength analysis dashboard",
    ],
  },
  {
    title: "Problem Discovery from the Web",
    description:
      "Our system scrapes real-world technical issues from forums like Reddit, Stack Overflow, and GitHub. Gemini AI detects emotion, urgency, and relevance in each problem.",
    icon: <FileEdit className="w-8 h-8" />,
    bgColor: "bg-secondary/10",
    hoverClass: "hover:shadow-secondary/30",
    borderClass: "border-secondary/20",
    color: "text-secondary",
    learnMoreLink: "/form",
    details: [
      "Real-time problem scraping from multiple sources",
      "Sentiment and urgency analysis",
      "Customizable filtering options",
    ],
  },
  {
    title: "AI-Powered Idea Generation",
    description:
      "Based on your team's skills and selected problems, Gemini AI suggests personalized project ideas with full structure — including features, tools, and use cases.",
    icon: <Users className="w-8 h-8" />,
    bgColor: "bg-accent/10",
    hoverClass: "hover:shadow-accent/30",
    borderClass: "border-accent/20",
    color: "text-accent",
    learnMoreLink: "/form",
    details: [
      "Skills-matched project suggestions",
      "Comprehensive project structure generation",
      "Technology stack recommendations",
    ],
  },
  {
    title: "Track, Customize & Export",
    description:
      "Choose your favorite idea, assign team roles, and track progress. Export your idea in Markdown or PDF format for hackathons or team planning.",
    icon: <LineChart className="w-8 h-8" />,
    bgColor: "bg-green-500/10",
    hoverClass: "hover:shadow-green-500/30",
    borderClass: "border-green-500/20",
    color: "text-green-500",
    learnMoreLink: "/form",
    details: [
      "Multiple export formats (PDF, MD, DOCX)",
      "Role assignment and team management",
      "Progress tracking and analytics",
    ],
  },
];

export default function HowItWorksSection() {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section
      className="py-20 bg-background relative overflow-hidden"
      id="how-it-works"
      data-scroll
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl opacity-40"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-3 px-4 py-1 border-primary/20 text-primary bg-primary/5 backdrop-blur-sm"
          >
            Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our intelligent system streamlines your path from idea to fully
            realized application, making innovation accessible to everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative max-w-6xl mx-auto">
          {howItWorks.map((step, index) => (            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="scrollable-container"
              onClick={() => toggleCard(index)}
            >
              <Card
                className={`border ${
                  step.borderClass
                } bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg ${
                  step.hoverClass
                } ${
                  expandedCard === index
                    ? "scale-105 shadow-xl"
                    : "hover:-translate-y-1"
                } h-full glass-card render-optimized cursor-pointer`}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${step.bgColor} ${step.color}`}
                    >
                      {step.icon}
                    </div>

                    <div
                      className={`text-xs font-semibold inline-flex items-center px-2.5 py-0.5 rounded-md bg-background/50 backdrop-blur-sm ${step.color} border ${step.borderClass} w-fit`}
                    >
                      Step {index + 1}
                    </div>
                  </div>

                  <h3
                    className={`text-xl font-bold mb-2 ${
                      expandedCard === index ? step.color : ""
                    } transition-colors`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground flex-grow">
                    {step.description}
                  </p>

                  {/* Expanded details */}
                  <motion.div
                    className="mt-4 overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: expandedCard === index ? "auto" : 0,
                      opacity: expandedCard === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`pt-4 border-t ${step.borderClass} mt-2`}>
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <span className={`mr-2 mt-1 text-xs ${step.color}`}>
                              •
                            </span>
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={step.learnMoreLink}
                        className="inline-block mt-4"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`${step.color} ${step.bgColor} hover:${step.bgColor} hover:bg-opacity-100 gap-1`}
                        >
                          Learn more
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/form">
            <Button className="bg-primary/90 hover:bg-primary text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/20">
              Try it yourself
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
