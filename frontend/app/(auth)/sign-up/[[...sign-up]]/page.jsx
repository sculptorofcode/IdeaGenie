"use client";
import { SignInButton } from "@civic/auth/react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
        <SignInButton>
          <Button>Sign up with Civic</Button>
        </SignInButton>
      </div>
    </div>
  );
}
