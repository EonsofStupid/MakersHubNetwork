
// Types for theme system
export type ThemeLogDetails = {
  errorMessage?: string;
  themeId?: string;
  tokenCount?: number;
  variables?: Record<string, unknown>;
  [key: string]: unknown;
};
