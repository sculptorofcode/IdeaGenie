"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useUser } from "@civic/auth/react";
import { Button } from "../../../components/ui/button";

export default function CtaSection() {
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // This would need to be properly implemented based on your auth system
  const signIn = () => {
    console.log("Sign in clicked");
    // Your sign in logic here
  };

  return (
    <section className="w-full py-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full bg-accent/10 blur-3xl animate-float-delay"></div>
      </div>

      <div className="container relative z-10 px-4">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Glowing border container */}
          <div className="p-[2px] rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent max-w-4xl mx-auto shadow-lg">
            <div className="bg-background/90 backdrop-blur-md rounded-2xl p-12 md:p-16">
              <motion.h2                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary sm:text-5xl md:text-6xl"
              >
                Ready to Build Your Next Big Project?
              </motion.h2>
              <motion.p                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
              >
                Join thousands of tech teams and innovators turning ideas into
                reality with AI-powered suggestions and real-world challenges
                — only on IdeaGenie.
              </motion.p>
              <motion.div                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-10"
              >
                {user ? (
                  <Link href="/dashboard" passHref>
                    <Button
                      size="xl"
                      className="relative overflow-hidden px-8 py-6 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:shadow-xl hover:scale-105"
                    >
                      <span className="relative z-10 flex items-center">
                        Start Your Journey Today
                        <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                      {/* Button shine effect */}
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] -translate-x-full group-hover:translate-x-full"></span>
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <div
                    className={`transition-all duration-300 delay-300 ${
                      isMounted
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                    }`}
                  >
                    <Button
                      size="xl"
                      className="relative overflow-hidden px-8 py-6 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:shadow-xl hover:scale-105"
                      onClick={signIn}
                    >
                      <span className="relative z-10 flex items-center">
                        Start Your Journey Today
                        <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                      {/* Button shine effect */}
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] -translate-x-full group-hover:translate-x-full"></span>
                      </span>
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Floating animated elements */}
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-primary/10 blur-xl animate-float-slow z-0"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-secondary/10 blur-xl animate-float-delay-slow z-0"></div>
        </div>
      </div>
    </section>
  );
}
