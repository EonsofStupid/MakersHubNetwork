
import { ImpulseTheme } from "./impulse.types";
import { Theme as BaseTheme } from "@/types/theme";

export interface AdminTheme extends BaseTheme {
  // Admin-specific theme extensions
  impulse: ImpulseTheme;
}

export interface ThemeContextValue {
  currentTheme: AdminTheme | null;
  isLoading: boolean;
  error: Error | null;
  applyTheme: (themeId: string) => Promise<void>;
  updateTheme: (updates: Partial<ImpulseTheme>) => void;
  saveTheme: () => Promise<void>;
  resetTheme: () => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultThemeId?: string;
}
