import { create } from "zustand";
import { Theme, ThemeComponent, ThemeToken } from "@/types/theme";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ThemeStore } from "./types";

export const useThemeStore = create<ThemeStore>((set) => ({
  currentTheme: null,
  themeTokens: [],
  themeComponents: [],
  adminComponents: [],
  isLoading: false,
  error: null,

  setTheme: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log("Fetching default theme...");

      const { data: theme, error: themeError } = await supabase
        .from('themes')
        .select('*')
        .eq('is_default', true)
        .single();

      console.log("Theme query result:", theme);
      console.log("Theme query error:", themeError);

      if (themeError) throw themeError;

      set({
        currentTheme: theme,
        error: null
      });

    } catch (error) {
      console.error("Error in setTheme:", error);
      set({ error: error as Error });
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
        .eq('context', 'admin');

      if (error) throw error;

      set({ 
        adminComponents: adminComponents?.map(comp => ({
          ...comp,
          styles: comp.styles as Record<string, any>
        })) || [] 
      });
    } catch (error) {
      set({ error: error as Error });
      toast({
        title: "Error Loading Admin Components",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));