"use client"

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import HeroSection from "../components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import Image from "next/image";
import { features } from "../data/features";
import { testimonial } from "../data/testimonial";
import { faqs } from "../data/faqs";
import { howItWorks } from "../data/howItWorks";

const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounting();
          observerRef.current.unobserve(ref.current);
        }
      },
      { threshold: 0.5 }
    );    if (ref.current) {
      observerRef.current.observe(ref.current);
    }

    const currentRef = ref.current; // Store the ref value in a variable

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);      }
    };
  }, [startCounting]);
  const startCounting = useCallback(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      const currentCount = Math.floor(progress * target);

      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCount);
  }, [duration, target]);

  return <span ref={ref}>{count}+</span>;
};

const MetallicHeading = ({ children }) => {
  return (
    <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 md:text-4xl lg:text-5xl silver-metallic-gradient relative">
      {children}
      <span className="block h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500"></span>
    </h2>
  );
};

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <MetallicHeading>Powerful Features for Your Career Growth</MetallicHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary transition-all duration-300 relative overflow-hidden group"
              >
                {/* Glossy border overlay (visible on hover) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                  <div className="absolute inset-0 glossy-hover-effect opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                
                <CardContent className="pt-6 text-center flex flex-col items-center relative z-10">
                  <div className="flex flex-col items-center justify-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <MetallicHeading>Our Impact in Numbers</MetallicHeading>
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

      {/* How It Works Section */}
<section className="w-full py-16 md:py-28 bg-gray-950 relative overflow-hidden">
  {/* Animated grid background */}
  <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
  </div>

  <div className="container mx-auto px-4 md:px-6 relative z-10">
    <div className="text-center mb-16">
      <MetallicHeading>How It Works</MetallicHeading>
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg text-gray-400 max-w-3xl mx-auto mt-4"
      >
        Four simple steps to accelerate your career growth
      </motion.p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {howItWorks.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          whileHover={{ y: -10 }}
          className="flex flex-col items-center text-center group"
        >
          <div className={`w-full h-full p-6 rounded-xl ${item.bgClass} ${item.borderClass} border relative overflow-hidden transition-all duration-500 group-hover:shadow-lg ${item.hoverClass}`}>
            {/* Hover shine effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_70%)]"></div>
              </div>
            </div>
            
            {/* Icon container with glow effect */}
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 rounded-xl bg-gray-900 flex items-center justify-center mb-6 mx-auto relative"
            >
              <div className="absolute inset-0 rounded-xl bg-current opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              {item.icon}
            </motion.div>
            
            <h3 className="font-bold text-xl mb-3 text-white">{item.title}</h3>
            <p className="text-gray-400 mb-4">{item.description}</p>
            
            {/* Animated step indicator */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex justify-center"
            >
              <span className="text-xs font-medium px-3 py-1 bg-gray-900 rounded-full text-primary border border-gray-800 group-hover:border-primary/50 transition-colors">
                Step {index + 1}
              </span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <MetallicHeading>What Our Users Say</MetallicHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-primary">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground italic relative">
                        <span className="text-3xl text-primary absolute -top-4 -left-2">
                          &quot;
                        </span>
                        {testimonial.quote}
                        <span className="text-3xl text-primary absolute -bottom-4">
                          &quot;
                        </span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ Section with Glass Effect */}
<section className="w-full py-12 md:py-24 bg-background relative">
  {/* Optional animated background (remove if you want plain background) */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
    <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
    <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-accent/5 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
  </div>

  <div className="container mx-auto px-4 md:px-6 relative z-10">
    <MetallicHeading>Frequently Asked Questions</MetallicHeading>
    <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
      Find answers to common questions about our platform
    </p>

    <div className="max-w-4xl mx-auto">
      <Accordion type="multiple" className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
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
                <span className="text-lg font-medium text-left text-white">{faq.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-0 text-white/80">
              <div className="pl-12">{faq.answer}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
</section>

      {/* Enhanced CTA Section */}
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
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary sm:text-5xl md:text-6xl"
          >
             Ready to Build Your Next Big Project?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
          >
            Join thousands of tech teams and innovators turning ideas into reality with AI-powered suggestions and real-world challenges — only on IdeaGenie.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Floating animated elements */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-primary/10 blur-xl animate-float-slow z-0"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-secondary/10 blur-xl animate-float-delay-slow z-0"></div>
    </div>
  </div>
</section>
    </>
  );
}