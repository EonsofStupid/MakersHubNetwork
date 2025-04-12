
export interface ThemeLogDetails extends Record<string, unknown> {
  success?: boolean;
  error?: boolean;
  theme?: string;
  errorMessage?: string;
  details?: Record<string, unknown>;
}
