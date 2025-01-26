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
      console.log("Fetching theme:", themeId);
      
      const { data: themes, error } = await supabase
        .from("themes")
        .select("*")
        .eq(themeId ? "id" : "is_default", themeId ? themeId : true)
        .limit(1);

      if (error) throw error;
      if (!themes || themes.length === 0) throw new Error("Theme not found");

      const theme = themes[0];
      console.log("Fetched theme:", theme);

      set({ 
        currentTheme: {
          id: theme.id,
          name: theme.name,
          description: theme.description,
          status: theme.status,
          is_default: theme.is_default,
          created_by: theme.created_by,
          created_at: theme.created_at,
          updated_at: theme.updated_at,
          published_at: theme.published_at,
          version: theme.version,
          cache_key: theme.cache_key,
          parent_theme_id: theme.parent_theme_id,
          design_tokens: theme.design_tokens || {},
          component_tokens: theme.component_tokens || {},
          composition_rules: theme.composition_rules || {}
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
        styles: comp.styles || {}
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