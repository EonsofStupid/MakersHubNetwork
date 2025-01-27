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

      // Type guard to ensure we have objects
      const designTokens = rawTheme.design_tokens && typeof rawTheme.design_tokens === 'object' && !Array.isArray(rawTheme.design_tokens) 
        ? rawTheme.design_tokens as Record<string, any>
        : {};
      
      const componentTokens = rawTheme.component_tokens && typeof rawTheme.component_tokens === 'object' && !Array.isArray(rawTheme.component_tokens)
        ? rawTheme.component_tokens as Record<string, any>
        : {};

      const theme: Theme = {
        ...rawTheme,
        design_tokens: {
          colors: (designTokens.colors as Record<string, any>) || {},
          spacing: (designTokens.spacing as Record<string, any>) || {},
          typography: {
            fontSizes: ((designTokens.typography as Record<string, any>)?.fontSizes as Record<string, any>) || {},
            fontFamilies: ((designTokens.typography as Record<string, any>)?.fontFamilies as Record<string, any>) || {},
            lineHeights: ((designTokens.typography as Record<string, any>)?.lineHeights as Record<string, any>) || {},
            letterSpacing: ((designTokens.typography as Record<string, any>)?.letterSpacing as Record<string, any>) || {}
          },
          effects: {
            shadows: ((designTokens.effects as Record<string, any>)?.shadows as Record<string, any>) || {},
            blurs: ((designTokens.effects as Record<string, any>)?.blurs as Record<string, any>) || {},
            gradients: ((designTokens.effects as Record<string, any>)?.gradients as Record<string, any>) || {}
          },
          animations: {
            keyframes: ((designTokens.animations as Record<string, any>)?.keyframes as Record<string, any>) || {},
            transitions: ((designTokens.animations as Record<string, any>)?.transitions as Record<string, any>) || {},
            durations: ((designTokens.animations as Record<string, any>)?.durations as Record<string, any>) || {}
          }
        },
        component_tokens: {
          base: (componentTokens.base as Record<string, any>) || {},
          variants: (componentTokens.variants as Record<string, any>) || {},
          states: (componentTokens.states as Record<string, any>) || {},
          responsive: (componentTokens.responsive as Record<string, any>) || {},
          darkMode: (componentTokens.darkMode as Record<string, any>) || {}
        },
        composition_rules: rawTheme.composition_rules && typeof rawTheme.composition_rules === 'object' && !Array.isArray(rawTheme.composition_rules)
          ? rawTheme.composition_rules as Record<string, any>
          : {},
        cached_styles: rawTheme.cached_styles && typeof rawTheme.cached_styles === 'object' && !Array.isArray(rawTheme.cached_styles)
          ? rawTheme.cached_styles as Record<string, any>
          : {}
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
        styles: comp.styles && typeof comp.styles === 'object' && !Array.isArray(comp.styles)
          ? comp.styles as Record<string, any>
          : {}
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