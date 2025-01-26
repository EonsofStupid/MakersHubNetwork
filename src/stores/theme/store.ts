import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { ThemeState } from "./types";

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
      console.log("Fetching theme with query:", themeId ? { id: themeId } : { is_default: true });
      
      const { data: themes, error } = await supabase
        .from("themes")
        .select("*")
        .eq(themeId ? "id" : "is_default", themeId || true)
        .limit(1)
        .throwOnError();

      if (error) throw error;
      if (!themes || themes.length === 0) throw new Error("No theme found");

      const theme = themes[0];
      console.log("Successfully fetched theme:", theme);

      // Type cast the JSON fields to Record<string, any>
      set({ 
        currentTheme: {
          ...theme,
          design_tokens: theme.design_tokens as Record<string, any> || {},
          component_tokens: theme.component_tokens as Record<string, any> || {},
          composition_rules: theme.composition_rules as Record<string, any> || {},
          cached_styles: theme.cached_styles as Record<string, any> || {}
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
      const { data, error } = await supabase
        .from("theme_components")
        .select("*")
        .eq("context", "admin");

      if (error) throw error;

      const components = data.map(comp => ({
        id: comp.id,
        theme_id: comp.theme_id,
        component_name: comp.component_name,
        context: comp.context,
        created_at: comp.created_at,
        updated_at: comp.updated_at,
        styles: comp.styles as Record<string, any> || {}
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