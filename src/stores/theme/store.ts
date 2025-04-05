
import { create } from "zustand";
import { ThemeState } from "./types";
import { Theme, ComponentTokens } from "@/types/theme";
import { getTheme } from "@/services/themeService";

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: null,
  themeTokens: [],
  themeComponents: [],
  adminComponents: [],
  isLoading: false,
  error: null,

  setTheme: async (themeId: string) => {
    set({ isLoading: true, error: null });
    try {
      // We receive a theme ID, fetch the theme
      const { theme: fetchedTheme } = await getTheme(themeId);
      
      if (!fetchedTheme || typeof fetchedTheme !== 'object') {
        throw new Error('Invalid theme data received');
      }

      // Ensure componentTokens has the correct type with proper mapping
      const componentTokens = Array.isArray(fetchedTheme.component_tokens)
        ? fetchedTheme.component_tokens.map((token: unknown): ComponentTokens => {
            // Safely cast the unknown token with proper checks
            const safeToken = token as Record<string, unknown>;
            
            return {
              id: typeof safeToken.id === 'string' ? safeToken.id : '',
              component_name: typeof safeToken.component_name === 'string' ? safeToken.component_name : '',
              styles: typeof safeToken.styles === 'object' && safeToken.styles !== null 
                ? safeToken.styles as Record<string, any> 
                : {},
              theme_id: typeof safeToken.theme_id === 'string' ? safeToken.theme_id : undefined,
              context: typeof safeToken.context === 'string' ? safeToken.context : undefined,
              created_at: typeof safeToken.created_at === 'string' ? safeToken.created_at : '',
              updated_at: typeof safeToken.updated_at === 'string' ? safeToken.updated_at : '',
              description: typeof safeToken.description === 'string' ? safeToken.description : '',
            };
          })
        : [];

      // Set the theme in the store
      set({ 
        currentTheme: { 
          ...fetchedTheme, 
          component_tokens: componentTokens 
        }, 
        isLoading: false 
      });
    } catch (error) {
      console.error("Error fetching theme:", error);
      set({ 
        error: error instanceof Error ? error : new Error("Failed to fetch theme"), 
        isLoading: false 
      });
    }
  },

  loadAdminComponents: async () => {
    set({ isLoading: true, error: null });
    try {
      // Use the theme service to get admin components
      const { theme: adminTheme } = await getTheme();
      
      // Type guard to ensure the component tokens are an array
      if (!Array.isArray(adminTheme.component_tokens)) {
        throw new Error('Admin theme component tokens are not an array');
      }
      
      // Filter for admin components with strict type checking
      const adminComponents = adminTheme.component_tokens.filter(comp => {
        const token = comp as Record<string, unknown>;
        return typeof token.context === 'string' && token.context === 'admin';
      });
      
      const components: ComponentTokens[] = adminComponents.map(comp => {
        const token = comp as Record<string, unknown>;
        return {
          id: typeof token.id === 'string' ? token.id : '',
          component_name: typeof token.component_name === 'string' ? token.component_name : '',
          styles: typeof token.styles === 'object' && token.styles !== null
            ? token.styles as Record<string, any>
            : {},
          description: typeof token.description === 'string' ? token.description : '', 
          theme_id: typeof token.theme_id === 'string' ? token.theme_id : undefined,
          context: typeof token.context === 'string' ? token.context : undefined,
          created_at: typeof token.created_at === 'string' ? token.created_at : '',
          updated_at: typeof token.updated_at === 'string' ? token.updated_at : ''
        };
      });

      set({ adminComponents: components, isLoading: false });
    } catch (error) {
      console.error("Error loading admin components:", error);
      set({ 
        error: error instanceof Error ? error : new Error("Failed to load admin components"), 
        isLoading: false 
      });
    }
  }
}));
