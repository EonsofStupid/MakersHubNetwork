
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
  saveTheme: (theme: Partial<AdminTheme>) => Promise<boolean>;
  themeComponents: any[];
  themeTokens: any[];
  themeValues: Record<string, string>;
}
