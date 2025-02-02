import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      spacing: {
        '33': '8.25rem',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--text-primary)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--text-secondary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--text-heading)",
        },
        neon: {
          cyan: "var(--neon-cyan)",
          pink: "var(--neon-pink)",
          purple: "var(--neon-purple)",
        },
        brand: {
          purple: "#4d00b3",
          magenta: "#72228c",
          lime: "#b0e653",
          cyan: "#41f0db"
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        'glass-card': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        'glass-hover': 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
        'cyber-grid': 'radial-gradient(circle at center, rgba(65, 240, 219, 0.1) 0%, transparent 70%)',
        'scratch-overlay': 'linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.02))',
        'brand-gradient': 'linear-gradient(135deg, #4d00b3, #72228c, #b0e653)',
        'admin-gradient': 'linear-gradient(135deg, #41f0db, #4d00b3, #b0e653)',
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;