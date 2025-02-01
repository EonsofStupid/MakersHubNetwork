import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
          DEFAULT: "#00F0FF",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FF2D6E",
          foreground: "#FFFFFF",
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
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
      },
      keyframes: {
        "morph-header": {
          "0%": {
            clipPath: "polygon(5% 0, 95% 0, 100% 100%, 0 100%)",
            transform: "translateZ(0)",
          },
          "100%": {
            clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)",
            transform: "translateZ(20px)",
          },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        "pulse-slow": {
          "0%": { opacity: "0.4", transform: "translateY(0)" },
          "50%": { opacity: "0.1", transform: "translateY(-100vh)" },
          "100%": { opacity: "0.4", transform: "translateY(-200vh)" },
        },
        "stream-horizontal": {
          "0%": { transform: "translateX(100vw)", opacity: "0" },
          "5%": { opacity: "1" },
          "95%": { opacity: "1" },
          "100%": { transform: "translateX(-100vw)", opacity: "0" },
        },
        "stream-vertical": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "5%": { opacity: "1" },
          "95%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        "rotate-y": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
      },
      animation: {
        "morph-header": "morph-header 1.5s ease-in-out forwards",
        "morph-header-reverse": "morph-header 1.5s ease-in-out forwards reverse",
        "gradient": "gradient 15s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse-slow 8s linear infinite",
        "stream-horizontal": "stream-horizontal var(--stream-duration) linear infinite",
        "stream-vertical": "stream-vertical var(--stream-duration) linear infinite",
        "rotate-y": "rotate-y 0.7s ease-in-out forwards",
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
