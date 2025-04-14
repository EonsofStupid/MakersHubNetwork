
// Theme log details type for theme-related logs
export interface ThemeLogDetails {
  theme?: string;
  themeId?: string;
  success?: boolean;
  error?: string | Error;
  errorMessage?: string;
  details?: Record<string, unknown>;
  source?: string;
  tags?: string[];
}
