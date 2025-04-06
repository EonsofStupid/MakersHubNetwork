
/**
 * Theme tokens schema and fallback values
 */

export interface ThemeTokens {
  // Colors
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  
  // Effect colors
  effectPrimary: string;
  effectSecondary: string;
  effectTertiary: string;
  
  // Timing variables
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  
  // Border radius variables
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
}

// Fallback tokens for when the theme service fails
export const fallbackTokens: ThemeTokens = {
  primary: "#00F0FF",
  secondary: "#FF2D6E",
  accent: "#8B5CF6",
  background: "#080F1E",
  foreground: "#F9FAFB",
  card: "#0E172A",
  cardForeground: "#F9FAFB", 
  muted: "#131D35",
  mutedForeground: "#94A3B8",
  border: "#131D35",
  input: "#131D35",
  ring: "#1E293B",
  effectPrimary: "#00F0FF",
  effectSecondary: "#FF2D6E",
  effectTertiary: "#8B5CF6",
  transitionFast: "150ms",
  transitionNormal: "300ms",
  transitionSlow: "500ms",
  radiusSm: "0.25rem",
  radiusMd: "0.5rem",
  radiusLg: "0.75rem",
  radiusFull: "9999px",
};
