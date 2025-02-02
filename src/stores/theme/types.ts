import { Theme, ThemeToken, ComponentTokens } from "@/types/theme";

export interface ThemeState {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ComponentTokens[];
  adminComponents: ComponentTokens[];
  isLoading: boolean;
  error: Error | null;
  setTheme: (themeId: string) => Promise<void>;
  loadAdminComponents: () => Promise<void>;
}

export interface ThemeActions {
  setTheme: (themeId: string) => Promise<void>;
  loadAdminComponents: () => Promise<void>;
}

export type ThemeStore = ThemeState & ThemeActions;