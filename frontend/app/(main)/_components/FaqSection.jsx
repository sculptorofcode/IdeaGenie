"use client";

import React from "react";
import { motion } from "framer-motion";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our platform
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="multiple" className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
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
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
