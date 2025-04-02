
import { ThemeRegistry } from "../types/impulse.types";
import { defaultImpulseTokens } from "./impulse/tokens";

// Theme registry with standardized naming
export const themeRegistry: ThemeRegistry = {
  impulsivity: {
    name: "Impulsivity",
    description: "The default cyberpunk theme with neon glows and glass morphism",
    theme: defaultImpulseTokens
  },
  
  minimal: {
    name: "Minimal",
    description: "A clean, minimalist theme focused on content",
    theme: {
      ...defaultImpulseTokens,
      colors: {
        ...defaultImpulseTokens.colors,
        primary: "#3B82F6",
        secondary: "#6366F1",
        background: {
          main: "#1F2937",
          card: "rgba(31, 41, 55, 0.8)",
          overlay: "rgba(31, 41, 55, 0.9)"
        },
        borders: {
          normal: "rgba(75, 85, 99, 0.4)",
          hover: "rgba(75, 85, 99, 0.6)",
          active: "rgba(75, 85, 99, 0.8)"
        }
      },
      effects: {
        ...defaultImpulseTokens.effects,
        glow: {
          primary: "none",
          secondary: "none",
          hover: "0 0 5px rgba(59, 130, 246, 0.5)"
        }
      }
    }
  },
  
  cyberpunk: {
    name: "Cyberpunk",
    description: "High contrast cybernetic theme with vibrant colors",
    theme: {
      ...defaultImpulseTokens,
      colors: {
        ...defaultImpulseTokens.colors,
        primary: "#F9CB28",
        secondary: "#EF4444",
        background: {
          main: "#09071B",
          card: "rgba(9, 7, 27, 0.8)",
          overlay: "rgba(9, 7, 27, 0.9)"
        },
        text: {
          primary: "#FFFFFF",
          secondary: "rgba(255, 255, 255, 0.7)",
          accent: "#F9CB28"
        }
      }
    }
  },
  
  neon: {
    name: "Neon",
    description: "Vibrant neon colors with dark background",
    theme: {
      ...defaultImpulseTokens,
      colors: {
        ...defaultImpulseTokens.colors,
        primary: "#0FF0FC",
        secondary: "#FC0FFE",
        background: {
          main: "#0D0D0D",
          card: "rgba(13, 13, 13, 0.8)",
          overlay: "rgba(13, 13, 13, 0.9)"
        }
      },
      effects: {
        ...defaultImpulseTokens.effects,
        glow: {
          primary: "0 0 20px rgba(15, 240, 252, 0.8)",
          secondary: "0 0 20px rgba(252, 15, 254, 0.8)",
          hover: "0 0 30px rgba(15, 240, 252, 0.9)"
        }
      }
    }
  },
  
  dark: {
    name: "Dark",
    description: "Simple dark theme with minimal effects",
    theme: {
      ...defaultImpulseTokens,
      colors: {
        ...defaultImpulseTokens.colors,
        primary: "#64748B",
        secondary: "#94A3B8",
        background: {
          main: "#0F172A",
          card: "rgba(15, 23, 42, 0.8)",
          overlay: "rgba(15, 23, 42, 0.9)"
        }
      },
      effects: {
        ...defaultImpulseTokens.effects,
        glow: {
          primary: "none",
          secondary: "none",
          hover: "none"
        }
      }
    }
  },
  
  light: {
    name: "Light",
    description: "Clean light theme for better daylight visibility",
    theme: {
      ...defaultImpulseTokens,
      colors: {
        ...defaultImpulseTokens.colors,
        primary: "#0F172A",
        secondary: "#334155",
        background: {
          main: "#F8FAFC",
          card: "rgba(248, 250, 252, 0.8)",
          overlay: "rgba(248, 250, 252, 0.9)"
        },
        text: {
          primary: "#0F172A",
          secondary: "rgba(15, 23, 42, 0.7)",
          accent: "#0F172A"
        },
        borders: {
          normal: "rgba(203, 213, 225, 0.8)",
          hover: "rgba(148, 163, 184, 0.8)",
          active: "rgba(100, 116, 139, 0.8)"
        }
      }
    }
  }
};

// Get a theme from the registry by key
export function getTheme(key: string) {
  return themeRegistry[key] || themeRegistry.impulsivity;
}

// Get all available themes
export function getAllThemes() {
  return Object.entries(themeRegistry).map(([key, theme]) => ({
    id: key,
    ...theme
  }));
}
