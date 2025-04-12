
export interface ThemeLogDetails {
  success?: boolean;
  error?: boolean;
  theme?: string;
  errorMessage?: string;
  details?: Record<string, unknown>;
}
