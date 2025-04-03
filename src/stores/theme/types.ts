
import { Theme, ThemeToken, ComponentTokens } from "@/types/theme";

export interface ThemeComponent extends ComponentTokens {
  theme_id: string;
  context: 'site' | 'admin' | 'chat';
}

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
  loadAdminComponents: () => Promise<ThemeComponent[]>;
  hydrateTheme: () => Promise<void>;
  updateComponent: (component: ThemeComponent) => Promise<ThemeComponent>;
  createComponent: (component: Omit<ThemeComponent, 'id' | 'created_at' | 'updated_at'>) => Promise<ThemeComponent>;
  deleteComponent: (componentId: string) => Promise<void>;
}

export type ThemeStore = ThemeState & ThemeActions;
