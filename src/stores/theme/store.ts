import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { ThemeState } from "./types";
import { Theme, ComponentTokens } from "@/types/theme";
import { Json } from "@/integrations/supabase/types";

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
        ? rawTheme.design_tokens
        : {};
      
      const componentTokens = rawTheme.component_tokens && typeof rawTheme.component_tokens === 'object' && !Array.isArray(rawTheme.component_tokens)
        ? rawTheme.component_tokens as ComponentTokens[]
        : [];

      const theme: Theme = {
        ...rawTheme,
        design_tokens: designTokens,
        component_tokens: componentTokens,
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

      const components: ComponentTokens[] = data.map(comp => ({
        id: comp.id,
        component_name: comp.component_name,
        styles: comp.styles as Record<string, any>,
        description: '',
        theme_id: comp.theme_id,
        context: comp.context,
        created_at: comp.created_at,
        updated_at: comp.updated_at
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