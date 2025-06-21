"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../components/ui/accordion";

export const faqs = [
  {
    question: "What makes IdeaGenie perfect for team-based innovation?",
    answer:
      "IdeaGenie brings your team's skills together using intelligent mapping. It analyzes each member’s strengths and recommends project ideas tailored to your team’s combined capabilities. This promotes efficient collaboration and ensures everyone contributes where they shine.",
  },
  {
    question: "How does IdeaGenie suggest custom project ideas?",
    answer:
      "Our AI scans the skill sets of your team, trending technologies, and problem statements from real-world sources. Based on this data, it generates personalized project ideas that are relevant, feasible, and competition-ready.",
  },
  {
    question: "How often are trends and technologies updated in IdeaGenie?",
    answer:
      "We update our AI database regularly with new technologies, domains, and hackathon trends—at least twice a month—so your team always gets fresh, up-to-date project ideas aligned with the latest innovations.",
  },
  {
    question: "Is my team data safe on the platform?",
    answer:
      "Yes! Your data privacy is a priority. IdeaGenie uses encrypted storage and secure authentication methods to keep your team profiles and idea history completely safe and confidential.",
  },
  {
    question: "Can I track our idea-building progress?",
    answer:
      "Yes, IdeaGenie offers a built-in progress tracker where you can log milestones, assign tasks, and monitor how your project idea evolves from concept to implementation.",
  },
  {
    question: "Can I fine-tune the AI’s project suggestions?",
    answer:
      "Absolutely. You can adjust filters like domain, difficulty level, team size, or preferred tech stacks. The more you interact, the better IdeaGenie understands your needs and refines its suggestions.",
  },
];

export default function FaqSection() {
  return (
    <section
      className="w-full py-12 md:py-24 bg-background relative"
      id="faqs"
      data-scroll
    >
      {/* Optional animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-accent/5 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our platform
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="multiple" className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="">
                <AccordionItem
                  value={`item-${index}`}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/10 transition-all"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-white transition-transform duration-200"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                      <span className="text-lg font-medium text-left text-white">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-0 text-white/80">
                    <div className="pl-12">{faq.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
