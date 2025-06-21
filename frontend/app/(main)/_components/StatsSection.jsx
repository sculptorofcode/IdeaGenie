"use client";

import React from "react";
import { motion } from "framer-motion";
import AnimatedCounter from './../../../components/AnimatedCounter';

export default function StatsSection() {
  return (
    <section 
      className="w-full py-12 md:py-24 bg-muted/50"
      data-scroll
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            Our Impact in Numbers
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          <motion.div            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <h3 className="text-4xl font-bold">
              <AnimatedCounter target={50} duration={9000} />
            </h3>
            <p className="text-muted-foreground">Domains Covered</p>
          </motion.div>
          <motion.div            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <h3 className="text-4xl font-bold">
              <AnimatedCounter target={1000} duration={9000} />
            </h3>
            <p className="text-muted-foreground">Unique Ideas Generated</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}            viewport={{ once: false }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <h3 className="text-4xl font-bold">
              <AnimatedCounter target={95} duration={9000} />
            </h3>
            <p className="text-muted-foreground">Team Matches Suggested</p>
          </motion.div>
          <motion.div            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <h3 className="text-4xl font-bold">24/7</h3>
            <p className="text-muted-foreground">Smart Assistance</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
