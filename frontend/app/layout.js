import { Inter } from "next/font/google";
import "./globals.css";
import { CivicAuthProvider } from "@civic/auth/nextjs";
import { Toaster } from "sonner";
import Header from "../components/header";
import { ThemeProvider } from "../components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Career Coach",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className={`${inter.className}`}>
        <CivicAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="bg-muted/50 py-16 border-t border-gray-700">
              <div className="container mx-auto px-4 text-center">
                {/* Massive DevXtreme text */}
                <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-300 opacity-90 mb-4 tracking-tight">
                  DEVXTREME
                </p>

                {/* Supporting text */}
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                  Transforming careers through innovative AI solutions and
                  cutting-edge technology
                </p>

                {/* Links
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">
                    About Us
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">
                    Services
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">
                    Careers
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">
                    Contact
                  </a>
                </div> */}

                {/* Copyright */}
                <p className="text-gray-500 text-xs tracking-widest">
                  © {new Date().getFullYear()} TEAM DEVXTREME AT KGEC. ALL
                  RIGHTS RESERVED.
                </p>
              </div>{" "}
            </footer>
          </ThemeProvider>
        </CivicAuthProvider>
      </body>
    </html>
  );
}
