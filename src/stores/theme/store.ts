import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { Theme, ComponentToken } from "@/schemas/theme.schema";
import { themeSchema, componentTokenSchema } from "@/schemas/theme.schema";
import { toast } from "@/components/ui/use-toast";

interface ThemeStore {
  currentTheme: Theme | null;
  themeTokens: ComponentToken[];
  themeComponents: ComponentToken[];
  adminComponents: ComponentToken[];
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
      // If no specific theme ID is provided, fetch the default theme
      const query = supabase
        .from('themes')
        .select('*');
        
      if (themeId) {
        query.eq('id', themeId);
      } else {
        query.eq('is_default', true);
      }

      const { data: themeData, error: themeError } = await query.single();

      if (themeError) throw themeError;

      console.log('Fetched theme data:', themeData);

      // Fetch associated tokens
      const { data: tokensData, error: tokensError } = await supabase
        .from('theme_tokens')
        .select('*')
        .eq('theme_id', themeData.id);

      if (tokensError) throw tokensError;

      console.log('Fetched theme tokens:', tokensData);

      // Fetch components
      const { data: componentsData, error: componentsError } = await supabase
        .from('theme_components')
        .select('*')
        .eq('theme_id', themeData.id);

      if (componentsError) throw componentsError;

      console.log('Fetched theme components:', componentsData);

      // Parse and validate components
      const validatedComponents = componentsData.map(comp => 
        componentTokenSchema.parse({
          ...comp,
          styles: comp.styles || {},
          tokens: {},
        })
      );

      // Parse and validate theme data
      const validatedTheme = themeSchema.parse({
        ...themeData,
        component_tokens: validatedComponents,
      });

      set({
        currentTheme: validatedTheme,
        themeTokens: tokensData || [],
        themeComponents: validatedComponents,
        isLoading: false,
      });

      toast({
        title: "Theme loaded",
        description: `Successfully loaded theme: ${validatedTheme.name}`,
      });
    } catch (error) {
      console.error("Theme loading error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load theme";
      
      toast({
        title: "Error loading theme",
        description: errorMessage,
        variant: "destructive",
      });
      
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

      const validatedComponents = data.map(comp => 
        componentTokenSchema.parse({
          ...comp,
          styles: comp.styles || {},
        })
      );

      set({ adminComponents: validatedComponents, isLoading: false });
    } catch (error) {
      console.error("Error loading admin components:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load admin components";
      
      toast({
        title: "Error loading components",
        description: errorMessage,
        variant: "destructive",
      });
      
      set({ 
        error: error instanceof Error ? error : new Error(errorMessage), 
        isLoading: false 
      });
    }
  }
}));