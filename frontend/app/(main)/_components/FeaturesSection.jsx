"use client";

import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { BrainCircuit, Briefcase, ScrollText, LineChart  } from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Idea Generator",
    description:
      "Discover tailored project ideas based on your team's skills and current trends.",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Team Skill Mapping",
    description:
      "Combine team members’ strengths to create a smart project profile.",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Hackathon & Event Tools",
    description:
      " Prepare with customized suggestions and insights for competitions.",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Idea Suggestions",
    description: "Get intelligent recommendations with real-time relevance.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background/50" id="features" data-scroll>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            Powerful Features for Your Career Growth
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our intelligent tools empower your journey through innovation,
            making development more accessible and enjoyable.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-transparent hover:border-primary/30 transition-all duration-500 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Glossy border overlay (visible on hover) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
                  {/* Animated glow effect */}
                  <div className="absolute -inset-[150%] top-1/2 left-1/2 w-[20px] h-[200px] bg-primary/30 opacity-0 group-hover:opacity-100 rotate-45 blur-2xl group-hover:animate-[spin_3s_linear_infinite] transition-all"></div>
                </div>
              </div>

              {/* Top corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 grid place-items-center rounded-bl-lg"
                  style={{
                    background:
                      index === 0
                        ? "linear-gradient(135deg, rgba(99, 102, 241, 0.3), transparent)"
                        : index === 1
                        ? "linear-gradient(135deg, rgba(16, 185, 129, 0.3), transparent)"
                        : index === 2
                        ? "linear-gradient(135deg, rgba(245, 158, 11, 0.3), transparent)"
                        : "linear-gradient(135deg, rgba(34, 197, 94, 0.3), transparent)",
                  }}
                >
                  {React.cloneElement(feature.icon, {
                    className: `w-6 h-6 opacity-80 ${
                      index === 0
                        ? "text-primary"
                        : index === 1
                        ? "text-secondary"
                        : index === 2
                        ? "text-accent"
                        : "text-success"
                    }`,
                  })}
                </div>
              </div>

              <CardContent className="pt-8 pb-8 text-center flex flex-col items-center relative z-10">
                <div className="flex flex-col items-center justify-center">
                  {/* Icon with enhanced styling */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5 relative transition-transform group-hover:scale-110 duration-500"
                    style={{
                      background:
                        index === 0
                          ? "rgba(99, 102, 241, 0.1)"
                          : index === 1
                          ? "rgba(16, 185, 129, 0.1)"
                          : index === 2
                          ? "rgba(245, 158, 11, 0.1)"
                          : "rgba(34, 197, 94, 0.1)",
                      boxShadow: `0 8px 32px -8px ${
                        index === 0
                          ? "rgba(99, 102, 241, 0.25)"
                          : index === 1
                          ? "rgba(16, 185, 129, 0.25)"
                          : index === 2
                          ? "rgba(245, 158, 11, 0.25)"
                          : "rgba(34, 197, 94, 0.25)"
                      }`,
                    }}
                  >
                    {React.cloneElement(feature.icon, {
                      className: `w-8 h-8 ${
                        index === 0
                          ? "text-primary"
                          : index === 1
                          ? "text-secondary"
                          : index === 2
                          ? "text-accent"
                          : "text-success"
                      }`,
                      style: {
                        transform: "scale(1)",
                        transition: "transform 0.3s ease",
                      },
                    })}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
