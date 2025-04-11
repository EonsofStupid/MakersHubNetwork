
export interface ThemeState {
  theme: string;
  tokens: Record<string, ThemeToken>;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface ThemeToken {
  id: string;
  name: string;
  value: string;
}

export interface Theme {
  id: string;
  name: string;
  tokens: Record<string, ThemeToken>;
}
