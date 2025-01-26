import { create } from "zustand";
import { Theme, ThemeComponent, ThemeToken } from "@/types/theme";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ThemeStore } from "./types";

export const useThemeStore = create<ThemeStore>((set, get) => ({
  currentTheme: null,
  themeTokens: [],
  themeComponents: [],
  adminComponents: [],
  isLoading: false,
  error: null,

  setTheme: async (themeId: string) => {
    try {
      set({ isLoading: true, error: null });

      // Fetch theme data
      const { data: theme, error: themeError } = await supabase
        .from('themes')
        .select('*')
        .eq('id', themeId)
        .single();

      if (themeError) throw themeError;

      // Fetch theme tokens
      const { data: tokens, error: tokensError } = await supabase
        .from('theme_tokens')
        .select('*')
        .eq('theme_id', themeId);

      if (tokensError) throw tokensError;

      // Fetch theme components
      const { data: components, error: componentsError } = await supabase
        .from('theme_components')
        .select('*')
        .eq('theme_id', themeId)
        .eq('context', 'default');

      if (componentsError) throw componentsError;

      set({
        currentTheme: theme,
        themeTokens: tokens || [],
        themeComponents: components?.map(comp => ({
          ...comp,
          styles: comp.styles as Record<string, any>
        })) || [],
        error: null
      });

    } catch (error) {
      console.error('Error loading theme:', error);
      set({ error: error as Error });
      toast({
        title: "Error Loading Theme",
        description: error instanceof Error ? error.message : "An error occurred while loading the theme",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  loadAdminComponents: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data: adminComponents, error } = await supabase
        .from('theme_components')
        .select('*')
        .eq('theme_id', get().currentTheme?.id)
        .eq('context', 'admin');

      if (error) throw error;

      set({ 
        adminComponents: adminComponents?.map(comp => ({
          ...comp,
          styles: comp.styles as Record<string, any>
        })) || [] 
      });
    } catch (error) {
      console.error('Error loading admin components:', error);
      set({ error: error as Error });
      toast({
        title: "Error Loading Admin Components",
        description: error instanceof Error ? error.message : "An error occurred while loading admin components",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));