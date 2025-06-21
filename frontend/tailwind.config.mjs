/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/globals.css",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      //  Mobile-first responsive breakpoints (added)
      screens: {
        xs: "375px", // Small phones
        sm: "480px", // Mobile
        md: "768px", // Tablet
        lg: "1024px", // Laptop
        xl: "1280px", // Desktop
        "2xl": "1536px", // Large screens
      },

      //  Responsive container (added)
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
        },
      },

      // Your existing configurations (preserved)
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        // Updated modern color palette
        primary: "#6366F1", // Indigo - Main brand color
        "primary-light": "#A5B4FC", // Light Indigo - For hover states
        "primary-dark": "#4F46E5", // Dark Indigo - For active states
        secondary: "#10B981", // Emerald - Complementary color
        "secondary-light": "#6EE7B7", // Light Emerald
        "secondary-dark": "#059669", // Dark Emerald
        accent: "#F59E0B", // Amber - For highlights and CTAs
        "accent-light": "#FCD34D", // Light Amber
        "accent-dark": "#D97706", // Dark Amber
        success: "#22C55E", // Green - For success states
        warning: "#F97316", // Orange - For warning states
        error: "#EF4444", // Red - For error states
        light: "#F9FAFB", // Almost white - Light backgrounds
        "light-2": "#F3F4F6", // Light gray - Secondary backgrounds
        "gray-1": "#E5E7EB", // Light gray - Borders
        "gray-2": "#9CA3AF", // Medium gray - Disabled text
        "gray-3": "#6B7280", // Dark gray - Secondary text
        dark: "#111827", // Almost black - For text
        "dark-2": "#1F2937", // Dark blue-gray - For secondary dark backgrounds
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "#6366F1", // Indigo
          2: "#10B981", // Emerald
          3: "#F59E0B", // Amber
          4: "#EC4899", // Pink
          5: "#8B5CF6", // Purple
          6: "#14B8A6", // Teal
          7: "#F43F5E", // Rose
          8: "#3B82F6", // Blue
        },
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
