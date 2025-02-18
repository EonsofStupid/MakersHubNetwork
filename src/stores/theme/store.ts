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
      const designTokens = rawTheme.design_tokens && typeof rawTheme.design_tokens === 'object' 
        ? rawTheme.design_tokens as Record<string, any>
        : {};
      
      // Convert component tokens to the correct type with proper mapping
      const componentTokens = rawTheme.component_tokens && Array.isArray(rawTheme.component_tokens)
        ? (rawTheme.component_tokens as Json[]).map((token): ComponentTokens => ({
            id: (token as any).id || '',
            component_name: (token as any).component_name || '',
            styles: (token as any).styles || {},
            theme_id: (token as any).theme_id,
            context: (token as any).context,
            created_at: (token as any).created_at,
            updated_at: (token as any).updated_at,
          }))
        : [];

      // Ensure composition rules is a Record
      const compositionRules = rawTheme.composition_rules && typeof rawTheme.composition_rules === 'object'
        ? rawTheme.composition_rules as Record<string, any>
        : {};

      const theme: Theme = {
        ...rawTheme,
        design_tokens: designTokens,
        component_tokens: componentTokens,
        composition_rules: compositionRules,
        cached_styles: rawTheme.cached_styles as Record<string, any> || {},
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