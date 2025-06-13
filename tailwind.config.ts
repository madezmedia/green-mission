import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // GMC Brand Colors - Exact Brand Palette
        "gmc-forest": {
          50: "#f8f6f3",   /* GMC Cream BG */
          100: "#f4f2ef",  /* GMC Cream Warm */
          200: "#c8d8c8",  /* Light border/input */
          300: "#a8c8b3",  /* GMC Mint Soft */
          400: "#7ba688",  /* GMC Sage Light */
          500: "#4a6b5c",  /* GMC Forest Medium */
          600: "#2d4a3a",  /* GMC Forest Dark */
          700: "#1f3329",  /* Dark forest secondary */
          800: "#142218",  /* Dark forest cards */
          900: "#0a1109",  /* Deep forest background */
        },
        "gmc-ocean": {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        "gmc-earth": {
          50: "#faf8f5",
          100: "#fefce8",
          200: "#fef08a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        "gmc-sunset": {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      fontFamily: {
        'gmc-primary': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        'gmc-secondary': ['Source Sans Pro', 'Open Sans', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'gmc-xs': '4px',
        'gmc-sm': '8px', 
        'gmc-md': '16px',
        'gmc-lg': '24px',
        'gmc-xl': '32px',
        'gmc-2xl': '48px',
        'gmc-3xl': '64px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'gmc': '0.75rem',
        'gmc-sm': '0.5rem',
        'gmc-lg': '1rem',
        'gmc-xl': '1.25rem',
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
        "theme-transition": {
          "0%": { opacity: "0.8" },
          "100%": { opacity: "1" },
        },
        "gmc-fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gmc-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "gmc-hover-lift": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-2px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "theme-transition": "theme-transition 0.3s ease-in-out",
        "gmc-fade-in": "gmc-fade-in 0.6s ease-out",
        "gmc-pulse": "gmc-pulse 2s infinite",
        "gmc-hover-lift": "gmc-hover-lift 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      boxShadow: {
        'gmc-sm': '0 2px 8px rgba(45, 74, 58, 0.08)',
        'gmc-md': '0 4px 12px rgba(45, 74, 58, 0.15)',
        'gmc-lg': '0 8px 24px rgba(45, 74, 58, 0.2)',
        'gmc-hover': '0 8px 24px rgba(45, 74, 58, 0.15)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
