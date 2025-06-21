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
  		screens: {
  			xs: '375px',
  			sm: '480px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1536px'
  		},
  		container: {
  			center: true,
  			padding: {
  				DEFAULT: '1rem',
  				sm: '1.5rem',
  				lg: '2rem'
  			}
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: 'hsl(var(--card))',
  			'card-foreground': 'hsl(var(--card-foreground))',
  			popover: 'hsl(var(--popover))',
  			'popover-foreground': 'hsl(var(--popover-foreground))',
  			primary: '#6366F1',
  			'primary-light': '#A5B4FC',
  			'primary-dark': '#4F46E5',
  			secondary: '#10B981',
  			'secondary-light': '#6EE7B7',
  			'secondary-dark': '#059669',
  			accent: '#F59E0B',
  			'accent-light': '#FCD34D',
  			'accent-dark': '#D97706',
  			success: '#22C55E',
  			warning: '#F97316',
  			error: '#EF4444',
  			light: '#F9FAFB',
  			'light-2': '#F3F4F6',
  			'gray-1': '#E5E7EB',
  			'gray-2': '#9CA3AF',
  			'gray-3': '#6B7280',
  			dark: '#111827',
  			'dark-2': '#1F2937',
  			destructive: 'hsl(var(--destructive))',
  			'destructive-foreground': 'hsl(var(--destructive-foreground))',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': '#6366F1',
  				'2': '#10B981',
  				'3': '#F59E0B',
  				'4': '#EC4899',
  				'5': '#8B5CF6',
  				'6': '#14B8A6',
  				'7': '#F43F5E',
  				'8': '#3B82F6'
  			}
  		},
  		borderRadius: {
  			DEFAULT: 'var(--radius)',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
