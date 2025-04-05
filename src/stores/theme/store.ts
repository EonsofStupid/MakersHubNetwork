
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

      // Ensure componentTokens has the correct type
      const componentTokens = Array.isArray(fetchedTheme.component_tokens)
        ? fetchedTheme.component_tokens.map((token): ComponentTokens => {
            // Already typed as ComponentTokens from validateTheme
            return token;
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
      
      // Filter for admin components
      const adminComponents = adminTheme.component_tokens.filter(comp => 
        comp.context === 'admin'
      );
      
      set({ adminComponents, isLoading: false });
    } catch (error) {
      console.error("Error loading admin components:", error);
      set({ 
        error: error instanceof Error ? error : new Error("Failed to load admin components"), 
        isLoading: false 
      });
    }
  }
}));
