
import { ImpulseTheme } from '../../types/impulse.types';

/**
 * Default Impulse theme tokens
 * These serve as fallbacks when database values are not available
 */
export const defaultImpulseTokens: ImpulseTheme = {
  colors: {
    primary: "#00F0FF",
    secondary: "#FF2D6E",
    background: {
      main: "rgba(15, 15, 15, 0.95)",
      card: "rgba(16, 20, 24, 0.7)",
      overlay: "rgba(25, 25, 30, 0.85)",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
      accent: "#00F0FF",
    },
    borders: {
      normal: "rgba(0, 240, 255, 0.2)",
      hover: "rgba(0, 240, 255, 0.4)",
      active: "rgba(0, 240, 255, 0.6)",
    },
  },
  effects: {
    glow: {
      primary: "0 0 15px rgba(0, 240, 255, 0.7)",
      secondary: "0 0 15px rgba(255, 45, 110, 0.7)",
      hover: "0 0 20px rgba(0, 240, 255, 0.9)",
    },
    blur: {
      background: "blur(12px)",
      overlay: "blur(8px)",
    },
    gradients: {
      main: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
      accent: "linear-gradient(135deg, #00F0FF 0%, #0072FF 100%)",
      card: "linear-gradient(135deg, rgba(16, 20, 24, 0.7) 0%, rgba(23, 25, 35, 0.7) 100%)",
    },
  },
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    curves: {
      bounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: "cubic-bezier(0.43, 0.13, 0.23, 0.96)",
    },
  },
  components: {
    panel: {
      borderRadius: "0.75rem",
      padding: "1rem",
    },
    button: {
      borderRadius: "0.5rem",
      padding: "0.5rem 1rem",
    },
    tooltip: {
      borderRadius: "0.5rem",
      padding: "0.5rem",
    },
  },
};
