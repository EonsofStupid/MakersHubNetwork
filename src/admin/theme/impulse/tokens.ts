
import { ImpulseTheme } from "../../types/impulse.types";

// Default tokens for the Impulsivity theme in the admin interface
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
      main: "linear-gradient(to right, #00F0FF, #FF2D6E)",
      accent: "linear-gradient(to right, #FF2D6E, #F97316)",
      card: "linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(0, 0, 0, 0) 50%)"
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
      padding: "1rem"
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

// Path to CSS variables mapping for the Impulsivity theme
export const cssVariableMapping = {
  "colors.primary": "--impulse-primary",
  "colors.secondary": "--impulse-secondary",
  "colors.background.main": "--impulse-bg-main",
  "colors.background.card": "--impulse-bg-card",
  "colors.background.overlay": "--impulse-bg-overlay",
  "colors.text.primary": "--impulse-text-primary",
  "colors.text.secondary": "--impulse-text-secondary",
  "colors.text.accent": "--impulse-text-accent",
  "colors.borders.normal": "--impulse-border-normal",
  "colors.borders.hover": "--impulse-border-hover",
  "colors.borders.active": "--impulse-border-active",
  "effects.glow.primary": "--impulse-glow-primary",
  "effects.glow.secondary": "--impulse-glow-secondary",
  "effects.glow.hover": "--impulse-glow-hover",
  "effects.blur.background": "--impulse-blur-bg",
  "effects.blur.overlay": "--impulse-blur-overlay",
  "animation.duration.fast": "--impulse-duration-fast",
  "animation.duration.normal": "--impulse-duration-normal",
  "animation.duration.slow": "--impulse-duration-slow",
  "animation.curves.bounce": "--impulse-curve-bounce",
  "animation.curves.ease": "--impulse-curve-ease",
  "animation.curves.spring": "--impulse-curve-spring",
  "components.panel.borderRadius": "--impulse-panel-radius",
  "components.panel.padding": "--impulse-panel-padding",
  "components.button.borderRadius": "--impulse-button-radius",
  "components.button.padding": "--impulse-button-padding",
  "components.tooltip.borderRadius": "--impulse-tooltip-radius",
  "components.tooltip.padding": "--impulse-tooltip-padding"
};

// Create CSS variables string for the Impulsivity theme
export function generateCSSVariables(theme: ImpulseTheme): string {
  let cssVars = ":root {\n";
  
  Object.entries(cssVariableMapping).forEach(([path, cssVar]) => {
    const value = getValueByPath(theme, path);
    if (value !== undefined) {
      cssVars += `  ${cssVar}: ${value};\n`;
    }
  });
  
  cssVars += "}\n";
  return cssVars;
}

// Helper function to get a value from a nested object using a path string
function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
}
