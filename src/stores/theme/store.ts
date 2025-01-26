import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { ThemeState } from "./types";
import { Theme, ThemeComponent } from "@/types/theme";

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

      const rawTheme = themes[0];
      console.log("Successfully fetched theme:", rawTheme);

      const theme: Theme = {
        ...rawTheme,
        design_tokens: rawTheme.design_tokens as Theme['design_tokens'] || {
          colors: {},
          spacing: {},
          typography: {
            fontSizes: {},
            fontFamilies: {},
            lineHeights: {},
            letterSpacing: {}
          },
          effects: {
            shadows: {},
            blurs: {},
            gradients: {}
          },
          animations: {
            keyframes: {},
            transitions: {},
            durations: {}
          }
        },
        component_tokens: rawTheme.component_tokens as Theme['component_tokens'] || {
          base: {},
          variants: {},
          states: {},
          responsive: {},
          darkMode: {}
        },
        composition_rules: rawTheme.composition_rules as Record<string, any> || {},
        cached_styles: rawTheme.cached_styles as Record<string, any> || {}
      };

      set({ currentTheme: theme, isLoading: false });
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

      const components: ThemeComponent[] = data.map(comp => ({
        id: comp.id,
        theme_id: comp.theme_id,
        component_name: comp.component_name,
        context: comp.context,
        created_at: comp.created_at,
        updated_at: comp.updated_at,
        styles: comp.styles as Record<string, any>
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