import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { Theme, ThemeComponent, ThemeToken, ComponentTokens } from "@/types/theme";

interface ThemeStore {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ComponentTokens[];
  adminComponents: ThemeComponent[];
  isLoading: boolean;
  error: Error | null;
  setTheme: (themeId: string) => Promise<void>;
  loadAdminComponents: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  currentTheme: null,
  themeTokens: [],
  themeComponents: [],
  adminComponents: [],
  isLoading: false,
  error: null,

  setTheme: async (themeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: themeData, error: themeError } = await supabase
        .from('themes')
        .select('*')
        .eq('id', themeId)
        .single();

      if (themeError) throw themeError;

      const { data: tokensData, error: tokensError } = await supabase
        .from('theme_tokens')
        .select('*')
        .eq('theme_id', themeId);

      if (tokensError) throw tokensError;

      const { data: componentsData, error: componentsError } = await supabase
        .from('theme_components')
        .select('*')
        .eq('theme_id', themeId);

      if (componentsError) throw componentsError;

      // Transform the components data to match ComponentTokens interface
      const transformedComponents: ComponentTokens[] = componentsData.map(comp => ({
        id: comp.id,
        component_name: comp.component_name,
        theme_id: comp.theme_id,
        styles: typeof comp.styles === 'object' && !Array.isArray(comp.styles) 
          ? comp.styles as Record<string, any>
          : {},
        tokens: {},
        description: comp.description || '',
        created_at: comp.created_at,
        updated_at: comp.updated_at
      }));

      // Transform theme data to match Theme interface
      const transformedTheme: Theme = {
        ...themeData,
        design_tokens: typeof themeData.design_tokens === 'object' 
          ? themeData.design_tokens as Record<string, any>
          : {},
        component_tokens: transformedComponents,
        composition_rules: typeof themeData.composition_rules === 'object'
          ? themeData.composition_rules as Record<string, any>
          : {},
        cached_styles: typeof themeData.cached_styles === 'object'
          ? themeData.cached_styles as Record<string, any>
          : {},
      };

      set({
        currentTheme: transformedTheme,
        themeTokens: tokensData || [],
        themeComponents: transformedComponents,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
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
        styles: typeof comp.styles === 'object' && !Array.isArray(comp.styles)
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