
const colors = {
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
  admin: {
    card: {
      DEFAULT: "rgba(16, 20, 24, 0.7)",
      hover: "rgba(20, 24, 28, 0.8)",
    },
    border: {
      DEFAULT: "rgba(0, 240, 255, 0.2)",
      hover: "rgba(0, 240, 255, 0.4)",
    },
    glow: {
      primary: "rgba(0, 240, 255, 0.5)",
      secondary: "rgba(255, 45, 110, 0.5)",
    }
  }
};

export default colors;
