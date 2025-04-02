
import { ImpulseTheme } from "../../types/impulse.types";

/**
 * Default tokens for the Impulsivity admin theme
 * These are applied immediately during page load for a smooth experience
 */
export const defaultImpulseTokens: ImpulseTheme = {
  colors: {
    primary: "#00F0FF",
    secondary: "#FF2D6E",
    background: {
      main: "#12121A",
      card: "rgba(28, 32, 42, 0.7)",
      overlay: "rgba(22, 24, 32, 0.85)"
    },
    text: {
      primary: "#F6F6F7",
      secondary: "rgba(255, 255, 255, 0.7)",
      accent: "#00F0FF"
    },
    borders: {
      normal: "rgba(0, 240, 255, 0.2)",
      hover: "rgba(0, 240, 255, 0.4)",
      active: "rgba(0, 240, 255, 0.6)"
    }
  },
  effects: {
    glow: {
      primary: "0 0 15px rgba(0, 240, 255, 0.7)",
      secondary: "0 0 15px rgba(255, 45, 110, 0.7)",
      hover: "0 0 20px rgba(0, 240, 255, 0.9)"
    },
    blur: {
      background: "blur(12px)",
      overlay: "blur(8px)"
    },
    gradients: {
      main: "linear-gradient(to right, rgba(0, 240, 255, 0.2), rgba(255, 45, 110, 0.2))",
      accent: "linear-gradient(45deg, rgba(0, 240, 255, 0.6), rgba(0, 240, 255, 0.2))",
      card: "radial-gradient(circle at top right, rgba(0, 240, 255, 0.1), transparent 70%)"
    }
  },
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms"
    },
    curves: {
      bounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: "cubic-bezier(0.43, 0.13, 0.23, 0.96)"
    }
  },
  components: {
    panel: {
      borderRadius: "0.75rem",
      padding: "1.5rem"
    },
    button: {
      borderRadius: "0.5rem",
      padding: "0.5rem 1rem"
    },
    tooltip: {
      borderRadius: "0.25rem",
      padding: "0.5rem"
    }
  }
};

// Theme registry with preset themes
export const themeRegistry = {
  impulsivity: {
    name: "Impulsivity",
    description: "Cyberpunk with neon accents",
    theme: defaultImpulseTokens
  },
  midnight: {
    name: "Midnight",
    description: "Dark theme with blue accents",
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
