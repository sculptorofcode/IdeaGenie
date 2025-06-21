import { Inter } from "next/font/google";
import "./globals.css";
import { CivicAuthProvider } from "@civic/auth/nextjs";
import { Toaster } from "sonner";
import Header from "../components/header";
import { ThemeProvider } from "../components/theme-provider";
import ScrollToTopButton from '../components/scroll-to-top';
import SmoothScrollInit from '../components/smooth-scroll-init';
import UserSync from '../components/UserSync';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IdeaGenie",
  description: "IdeaGenie - Transforming careers through innovative AI solutions and cutting-edge technology.",
  keywords: [
    "IdeaGenie",
    "AI",
    "Innovation",
    "Career",
    "Technology",
    "Hack4Bengal",
    "Ideation",
    "Productivity",
    "Next.js",
    "CivicAuth"
  ],
  authors: [
    { name: "405 Found", url: "https://saikatroy.vercel.app" }
  ],
  creator: "405 Found",
  publisher: "405 Found",
  applicationName: "IdeaGenie",
  icons: {
    icon: "/Logos.svg"
  },
  themeColor: "#18181b",
  openGraph: {
    title: "IdeaGenie",
    description: "Transforming careers through innovative AI solutions and cutting-edge technology.",
    url: "https://your-ideagenie-domain.com",
    siteName: "IdeaGenie",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IdeaGenie Open Graph Image"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "IdeaGenie",
    description: "Transforming careers through innovative AI solutions and cutting-edge technology.",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo4.svg" sizes="any" />
      </head>
      <body className={`${inter.className}`}>        <CivicAuthProvider>
          <UserSync />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SmoothScrollInit />
            <Header />
            <main className="min-h-screen">{children}</main>
            <ScrollToTopButton />
            <Toaster richColors />

            <footer className="bg-muted/50 py-16 border-t border-gray-700">
              <div className="container mx-auto px-4 text-center">
                {/* Massive DevXtreme text */}
                <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-300 opacity-90 mb-4 tracking-tight">
                  405 FOUND
                </p>

                {/* Supporting text */}
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                  Transforming careers through innovative AI solutions and
                  cutting-edge technology
                </p>

                {/* Copyright */}
                <p className="text-gray-500 text-xs tracking-widest">
                  © {new Date().getFullYear()} 405 Found AT HACK4BENGAL. ALL
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
