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

      // Ensure design_tokens has the correct structure
      const designTokens = typeof rawTheme.design_tokens === 'object' ? rawTheme.design_tokens : {};
      const componentTokens = typeof rawTheme.component_tokens === 'object' ? rawTheme.component_tokens : {};

      const theme: Theme = {
        ...rawTheme,
        design_tokens: {
          colors: designTokens.colors || {},
          spacing: designTokens.spacing || {},
          typography: {
            fontSizes: designTokens.typography?.fontSizes || {},
            fontFamilies: designTokens.typography?.fontFamilies || {},
            lineHeights: designTokens.typography?.lineHeights || {},
            letterSpacing: designTokens.typography?.letterSpacing || {}
          },
          effects: {
            shadows: designTokens.effects?.shadows || {},
            blurs: designTokens.effects?.blurs || {},
            gradients: designTokens.effects?.gradients || {}
          },
          animations: {
            keyframes: designTokens.animations?.keyframes || {},
            transitions: designTokens.animations?.transitions || {},
            durations: designTokens.animations?.durations || {}
          }
        },
        component_tokens: {
          base: componentTokens.base || {},
          variants: componentTokens.variants || {},
          states: componentTokens.states || {},
          responsive: componentTokens.responsive || {},
          darkMode: componentTokens.darkMode || {}
        },
        composition_rules: typeof rawTheme.composition_rules === 'object' ? rawTheme.composition_rules : {},
        cached_styles: typeof rawTheme.cached_styles === 'object' ? rawTheme.cached_styles : {}
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
        styles: typeof comp.styles === 'object' ? comp.styles : {}
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