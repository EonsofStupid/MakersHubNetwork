
import { Theme, ThemeToken, ThemeContext, ThemeComponent as BaseThemeComponent } from "@/types/theme";

// Make our local ThemeComponent extend the base one but with required context
export interface ThemeComponent extends Omit<BaseThemeComponent, 'context'> {
  theme_id: string;
  component_name: string;
  styles: Record<string, any>;
  description?: string;
  created_at?: string | null;
  updated_at?: string | null;
  context: ThemeContext; // Required
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

/**
 * Converts a component from the database to a strongly typed ThemeComponent
 */
export function convertToThemeComponent(component: any): ThemeComponent {
  return {
    id: component.id,
    theme_id: component.theme_id || '',
    component_name: component.component_name,
    styles: component.styles || {},
    description: component.description,
    created_at: component.created_at,
    updated_at: component.updated_at,
    context: component.context || 'site'
  };
}

/**
 * Safely transform an array of components from the database to ThemeComponent[]
 */
export function convertComponents(components: any[]): ThemeComponent[] {
  if (!Array.isArray(components)) return [];
  return components.map(convertToThemeComponent);
}
