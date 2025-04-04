
import { Theme, ThemeToken, ComponentTokens, ThemeContext } from "@/types/theme";

export interface ThemeComponent extends ComponentTokens {
  theme_id: string;
  context: ThemeContext;
}

export interface ThemeState {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ThemeComponent[];
  adminComponents: ThemeComponent[];
  siteComponents: ThemeComponent[]; 
  isLoading: boolean;
  error: Error | null;
  lastFetchTimestamp: string | null;
}

export interface ThemeActions {
  setTheme: (themeId: string) => Promise<Theme>;
  loadComponentsByContext: (context: 'site' | 'admin' | 'all') => Promise<ThemeComponent[]>;
  loadAdminComponents: () => Promise<ThemeComponent[]>;
  loadSiteComponents: () => Promise<ThemeComponent[]>;
  hydrateTheme: () => Promise<void>;
  updateComponent: (component: ThemeComponent) => Promise<ThemeComponent>;
  createComponent: (component: Omit<ThemeComponent, 'id' | 'created_at' | 'updated_at'>) => Promise<ThemeComponent>;
  deleteComponent: (componentId: string) => Promise<void>;
  updateCurrentTheme: (updatedTheme: Partial<Theme>) => void;
  applyDefaultTheme: () => void;
}

export type ThemeStore = ThemeState & ThemeActions;

// Type guards for better type safety
export function isThemeComponent(obj: any): obj is ThemeComponent {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.component_name === 'string' &&
    typeof obj.theme_id === 'string' &&
    typeof obj.context === 'string' &&
    obj.styles !== undefined
  );
}
