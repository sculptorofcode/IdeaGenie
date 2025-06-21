import { authMiddleware } from "@civic/auth/nextjs/middleware";

export default authMiddleware();

export const config = {
  matcher: [
    // Match all paths except static files and assets
    "/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif|.*\\.css|.*\\.js|.*\\.webp|.*\\.ttf|.*\\.woff2?|.*\\.ico|.*\\.csv|.*\\.docx?|.*\\.xlsx?|.*\\.zip|.*\\.webmanifest).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
