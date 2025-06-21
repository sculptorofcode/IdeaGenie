"use client";

import React from "react";
import AnimatedCounter from './../../../components/AnimatedCounter';

export default function StatsSection() {
  return (
    <section 
      className="w-full py-12 md:py-24 bg-muted/50"
      data-scroll
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            Our Impact in Numbers
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">
              <AnimatedCounter target={50} duration={9000} />
            </h3>
            <p className="text-muted-foreground">Domains Covered</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">
              <AnimatedCounter target={1000} duration={9000} />
            </h3>
            <p className="text-muted-foreground">Unique Ideas Generated</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">
              <AnimatedCounter target={95} duration={9000} />
            </h3>
            <p className="text-muted-foreground">Team Matches Suggested</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">24/7</h3>
            <p className="text-muted-foreground">Smart Assistance</p>
          </div>
        </div>
      </div>
    </section>
  );
}
