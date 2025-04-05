
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

  setTheme: async (themeIdOrTheme: string) => {
    set({ isLoading: true, error: null });
    try {
      // We receive a theme ID, fetch the theme
      const { theme: fetchedTheme } = await getTheme(themeIdOrTheme);
      const theme = fetchedTheme;

      // Ensure componentTokens has the correct type with proper mapping
      const componentTokens = theme.component_tokens && Array.isArray(theme.component_tokens)
        ? theme.component_tokens.map((token): ComponentTokens => ({
            id: (token as any).id || '',
            component_name: (token as any).component_name || '',
            styles: (token as any).styles || {},
            theme_id: (token as any).theme_id || undefined,
            context: (token as any).context || undefined,
            created_at: (token as any).created_at || '',
            updated_at: (token as any).updated_at || '',
            description: (token as any).description || '',
          }))
        : [];

      // Set the theme in the store
      set({ 
        currentTheme: { 
          ...theme, 
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
      
      // Filter for admin components
      const adminComponents = adminTheme.component_tokens.filter(
        comp => (comp as any).context === 'admin'
      );
      
      const components: ComponentTokens[] = adminComponents.map(comp => ({
        id: (comp as any).id,
        component_name: (comp as any).component_name,
        styles: (comp as any).styles as Record<string, any>,
        description: (comp as any).description || '', 
        theme_id: (comp as any).theme_id || undefined,
        context: (comp as any).context || undefined,
        created_at: (comp as any).created_at || '',
        updated_at: (comp as any).updated_at || ''
      }));

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
