"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import Link from "next/link";
import { UserButton, useUser, SignInButton } from "@civic/auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";

// Animated Logo component with glint effect
const AnimatedLogo = ({ scrolled }) => {
  return (
    <div className="relative logo-container overflow-hidden">
      <Image
        src={"/logo4.svg"}
        alt="Logo"
        width={260}
        height={80}
        className={`${scrolled ? 'h-10' : 'h-12'} py-1 w-auto object-contain hover:opacity-90 transition-all filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
        priority
      />
      {/* The glint effect is applied via CSS */}
    </div>
  );
};

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('none');
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { user } = useUser();
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate scroll progress percentage
      const progress = (currentScrollY / maxScroll) * 100;
      setScrollProgress(progress);
      
      // Determine if we've scrolled past threshold for style changes
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      // Show/hide header based on scroll direction and position
      if (currentScrollY > 500) {
        if (currentScrollY > lastScrollY + 10) { // Adding threshold to avoid flickering
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY - 10) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    // Throttle scroll events for performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 transform will-change-transform
        ${scrolled 
          ? 'bg-black/80 backdrop-blur-xl shadow-lg border-b border-white/10' 
          : 'bg-transparent border-b border-white/5 backdrop-blur-sm'}
        ${!isVisible ? '-translate-y-full' : 'translate-y-0'}
        ${scrollDirection === 'up' && scrolled ? 'shadow-xl border-b border-primary/20' : ''}
      `}
    >
      <nav className={`container mx-auto px-4 transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'} flex items-center justify-between`}>
        {/* Logo with glow effect */}
        <div className={`transition-all duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'} ${scrolled ? 'scale-95' : 'scale-100'}`}>
          <Link href="/">
            <AnimatedLogo scrolled={scrolled} />
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {user && (
            <>
              {/* Dashboard Button */}
              <div className={`transition-all duration-300 delay-100 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                <Link href="/form">
                  <Button
                    variant="ghost"
                    className={`hidden md:flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all border border-white/10 hover:border-white/20 ${
                      scrolled ? 'px-2.5 py-1.5 text-sm' : 'px-3 py-2'
                    }`}
                  >
                    <LayoutDashboard className={`transition-transform ${scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
                    <span>Hackathon & Event Tools</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`md:hidden text-white/90 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 p-0 transition-all ${
                      scrolled ? 'w-9 h-9' : 'w-10 h-10'
                    }`}
                    aria-label="Hackathon Tools"
                  >
                    <LayoutDashboard className={`transition-transform ${scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
                  </Button>
                </Link>
              </div>

              {/* Growth Tools Dropdown */}
              <div className={`transition-all duration-300 delay-200 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      className={`flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-purple-500/30 transition-all border-0 ${
                        scrolled ? 'px-2.5 py-1.5 text-sm' : 'px-3 py-2'
                      }`}
                    >
                      <StarsIcon className={`transition-transform ${scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
                      <span className="hidden md:block">Growth Tools</span>
                      <ChevronDown className={`transition-transform duration-200 ${scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 p-2 rounded-xl shadow-xl bg-black/80 backdrop-blur-lg border border-white/20"
                  >
                    <DropdownMenuItem asChild className="p-0 hover:bg-white/10">
                      <Link 
                        href="/form" 
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-white/90 hover:text-white transition-colors"
                      >
                        <FileText className="h-4 w-4 text-purple-400" />
                        AI‑Powered Idea Generator
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0 hover:bg-white/10">
                      <Link
                        href="/form"
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-white/90 hover:text-white transition-colors"
                      >
                        <PenBox className="h-4 w-4 text-blue-400" />
                        Team Skill Mapping
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0 hover:bg-white/10">
                      <Link 
                        href="/form" 
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-white/90 hover:text-white transition-colors"
                      >
                        <GraduationCap className="h-4 w-4 text-indigo-400" />
                        Smart Idea Suggestions
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}          
          {/* Sign In Button */}
          {!user && (
            <div className={`transition-all duration-300 delay-300 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
              <SignInButton>
                <Button 
                  variant="outline" 
                  className={`border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 shadow-sm backdrop-blur-sm transition-all ${
                    scrolled ? 'px-3 py-1 text-sm' : 'px-4 py-2'
                  }`}
                >
                  Sign In
                </Button>
              </SignInButton>
            </div>
          )}

          {/* User Button */}
          {user && (
            <div className={`transition-all duration-300 delay-400 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} ${
              scrolled ? 'scale-90' : 'scale-100'
            }`}>
              <UserButton />
            </div>
          )}
        </div>
      </nav>
      
      {/* Progress indicator */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black/50 overflow-hidden">
          <div 
            className="header-progress"
            style={{ 
              width: `${scrollProgress}%`,
            }}
          />
        </div>
      )}
    </header>
  );
}
