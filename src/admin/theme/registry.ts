
import { ImpulseTheme } from "../types/impulse.types";
import { ThemeRegistry } from "../types/impulse.types";
import { defaultImpulseTokens } from "./impulse/tokens";

// Theme registry with various presets
export const themeRegistry: ThemeRegistry = {
  impulsivity: {
    name: "Impulsivity",
    description: "Default cyberpunk theme with neon blues",
    theme: defaultImpulseTokens
  },
  midnight: {
    name: "Midnight",
    description: "Dark blue with subtle accents",
    theme: {
      ...defaultImpulseTokens,
      colors: {
        ...defaultImpulseTokens.colors,
        primary: "#3B82F6",
        secondary: "#A855F7",
        background: {
          main: "#0F172A",
          card: "rgba(30, 41, 59, 0.7)",
          overlay: "rgba(30, 41, 59, 0.85)"
        }
      }
    }
  },
  synthwave: {
    name: "Synthwave",
    description: "80s inspired purple and pink",
    theme: {
      ...defaultImpulseTokens,
      colors: {
        ...defaultImpulseTokens.colors,
        primary: "#D946EF",
        secondary: "#8B5CF6",
        background: {
          main: "#18122B",
          card: "rgba(45, 30, 75, 0.7)",
          overlay: "rgba(45, 30, 75, 0.85)"
        }
      }
    }
  },
  terminal: {
    name: "Terminal",
    description: "Hacker-inspired green on black",
    theme: {
      ...defaultImpulseTokens,
      colors: {
        ...defaultImpulseTokens.colors,
        primary: "#4ADE80",
        secondary: "#F97316",
        background: {
          main: "#0C0C0C",
          card: "rgba(20, 20, 20, 0.7)",
          overlay: "rgba(20, 20, 20, 0.85)"
        },
        text: {
          ...defaultImpulseTokens.colors.text,
          accent: "#4ADE80"
        }
      }
    }
  },
  neonNoir: {
    name: "Neon Noir",
    description: "Dark with red accents",
    theme: {
      ...defaultImpulseTokens,
      colors: {
        ...defaultImpulseTokens.colors,
        primary: "#EF4444",
        secondary: "#3B82F6",
        background: {
          main: "#09090B",
          card: "rgba(24, 24, 27, 0.7)",
          overlay: "rgba(24, 24, 27, 0.85)"
        },
        text: {
          ...defaultImpulseTokens.colors.text,
          accent: "#EF4444"
        },
        borders: {
          normal: "rgba(239, 68, 68, 0.2)",
          hover: "rgba(239, 68, 68, 0.4)",
          active: "rgba(239, 68, 68, 0.6)"
        }
      },
      effects: {
        ...defaultImpulseTokens.effects,
        glow: {
          primary: "0 0 15px rgba(239, 68, 68, 0.7)",
          secondary: "0 0 15px rgba(59, 130, 246, 0.7)",
          hover: "0 0 20px rgba(239, 68, 68, 0.9)"
        }
      }
    }
  }
};

// Utility to get all available themes
export function getAllThemes() {
  return Object.keys(themeRegistry).map(id => ({
    id,
    name: themeRegistry[id].name,
    description: themeRegistry[id].description,
    theme: themeRegistry[id].theme
  }));
}
