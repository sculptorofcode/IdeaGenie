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

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="fixed top-0 w-full bg-black/30 backdrop-blur-xl z-50 border-b border-white/20">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo with glow effect */}
        <div className={`transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
          <Link href="/">
            <Image
              src={"/logo4.svg"}
              alt="Logo"
              width={260}
              height={80}
              className="h-12 py-1 w-auto object-contain hover:opacity-90 transition-opacity filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              priority
            />
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {user && (
            <>
              {/* Dashboard Button */}
              <div className={`transition-all duration-300 delay-100 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-all border border-white/10 hover:border-white/20"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Hackathon & Event Tools</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="md:hidden w-10 h-10 p-0 text-white/90 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20"
                    aria-label="Dashboard"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Growth Tools Dropdown */}
              <div className={`transition-all duration-300 delay-200 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-purple-500/30 transition-all border-0"
                    >
                      <StarsIcon className="h-4 w-4" />
                      <span className="hidden md:block">Growth Tools</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 p-2 rounded-xl shadow-xl bg-black/80 backdrop-blur-lg border border-white/20"
                  >
                    <DropdownMenuItem asChild className="p-0 hover:bg-white/10">
                      <Link 
                        href="/resume" 
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-white/90 hover:text-white transition-colors"
                      >
                        <FileText className="h-4 w-4 text-purple-400" />
                        AI‑Powered Idea Generator
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0 hover:bg-white/10">
                      <Link
                        href="/ai-cover-letter"
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-white/90 hover:text-white transition-colors"
                      >
                        <PenBox className="h-4 w-4 text-blue-400" />
                        Team Skill Mapping
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0 hover:bg-white/10">
                      <Link 
                        href="/interview" 
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
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 shadow-sm backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </SignInButton>
            </div>
          )}

          {/* User Button */}
          {user && (
            <div className={`transition-all duration-300 delay-400 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
              <UserButton />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
