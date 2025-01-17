import { Theme, ThemeToken, ThemeComponent } from "@/types/theme";

export interface ThemeState {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ThemeComponent[];
  adminComponents: ThemeComponent[];
  isLoading: boolean;
  error: Error | null;
}

export interface ThemeActions {
  setTheme: (themeId: string) => Promise<void>;
  loadAdminComponents: () => Promise<void>;
}

export type ThemeStore = ThemeState & ThemeActions;