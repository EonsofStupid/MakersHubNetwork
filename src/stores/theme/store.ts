
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { ThemeState } from "./types";
import { Theme, ComponentTokens } from "@/types/theme";
import { Json } from "@/integrations/supabase/types";
import { isValidUUID } from "@/logging/utils/type-guards";
import { getLogger } from "@/logging";

// Create a logger instance for the theme store
const logger = getLogger('ThemeStore');

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: null,
  themeTokens: [],
  themeComponents: [],
  adminComponents: [],
  isLoading: false,
  error: null,

  setTheme: async (themeId: string) => {
    // Validate UUID before attempting to fetch
    if (!themeId) {
      logger.error('No theme ID provided to setTheme');
      set({ 
        error: new Error('No theme ID provided'), 
        isLoading: false 
      });
      return;
    }

    if (!isValidUUID(themeId)) {
      logger.error(`Invalid theme ID format: ${themeId}`);
      set({ 
        error: new Error(`Invalid theme ID format: ${themeId}`), 
        isLoading: false 
      });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      logger.info(`Fetching theme with ID: ${themeId}`);
      
      // First try to get theme from the database
      const { data: themes, error } = await supabase
        .from("themes")
        .select("*")
        .eq("id", themeId)
        .limit(1);

      if (error) {
        logger.error("Database error fetching theme:", { details: { error } });
        throw error;
      }
      
      if (!themes || themes.length === 0) {
        logger.error("No theme found for ID:", { details: { themeId } });
        throw new Error(`No theme found for ID: ${themeId}`);
      }

      const rawTheme = themes[0];
      logger.debug("Raw theme data received", { details: { id: rawTheme.id, name: rawTheme.name } });
      
      // Now get component tokens separately to ensure we have them even if RLS blocks direct access
      const { data: componentTokens, error: componentError } = await supabase
        .from("theme_components")
        .select("*")
        .eq("theme_id", themeId);

      if (componentError) {
        logger.warn("Error fetching component tokens, will use empty array:", { 
          details: { error: componentError } 
        });
      }
      
      // Type guard to ensure we have objects
      const designTokens = rawTheme.design_tokens && typeof rawTheme.design_tokens === 'object' 
        ? rawTheme.design_tokens as Record<string, any>
        : {};
      
      // Convert component tokens to the correct type with proper mapping
      const mappedComponentTokens = !componentError && componentTokens && Array.isArray(componentTokens)
        ? componentTokens.map((token): ComponentTokens => ({
            id: token.id || '',
            component_name: token.component_name || '',
            styles: token.styles || {},
            theme_id: token.theme_id || undefined,
            context: token.context || undefined,
            created_at: token.created_at || '',
            updated_at: token.updated_at || '',
            description: '', // Add default empty description
          }))
        : []; // Use empty array if there was an error or no components returned

      // Ensure composition rules is a Record
      const compositionRules = rawTheme.composition_rules && typeof rawTheme.composition_rules === 'object'
        ? rawTheme.composition_rules as Record<string, any>
        : {};

      const theme: Theme = {
        id: rawTheme.id,
        name: rawTheme.name,
        description: rawTheme.description || '', 
        status: rawTheme.status || 'draft', 
        is_default: rawTheme.is_default || false, 
        created_by: rawTheme.created_by || undefined,
        created_at: rawTheme.created_at || '', 
        updated_at: rawTheme.updated_at || '', 
        published_at: rawTheme.published_at || undefined,
        version: rawTheme.version || 1,
        cache_key: rawTheme.cache_key || undefined,
        parent_theme_id: rawTheme.parent_theme_id || undefined,
        design_tokens: designTokens,
        component_tokens: mappedComponentTokens,
        composition_rules: compositionRules,
        cached_styles: rawTheme.cached_styles as Record<string, any> || {},
      };

      logger.info("Theme loaded successfully", { details: { id: theme.id, name: theme.name } });
      set({ currentTheme: theme, isLoading: false });
    } catch (error) {
      logger.error("Error fetching theme:", { details: { error, themeId } });
      set({ 
        error: error instanceof Error ? error : new Error("Failed to fetch theme"), 
        isLoading: false 
      });
    }
  },

  loadAdminComponents: async () => {
    set({ isLoading: true, error: null });
    try {
      logger.info("Loading admin components");
      
      // Try to fetch admin components
      const { data, error } = await supabase
        .from("theme_components")
        .select("*")
        .eq("context", "admin");

      if (error) {
        logger.error("Database error loading admin components:", { details: { error } });
        throw error;
      }

      const components: ComponentTokens[] = data.map(comp => ({
        id: comp.id,
        component_name: comp.component_name,
        styles: comp.styles as Record<string, any>,
        description: '', // Default empty description 
        theme_id: comp.theme_id || undefined,
        context: comp.context || undefined,
        created_at: comp.created_at || '',
        updated_at: comp.updated_at || ''
      }));

      logger.info(`Loaded ${components.length} admin components`);
      set({ adminComponents: components, isLoading: false });
    } catch (error) {
      logger.error("Error loading admin components:", { details: { error } });
      set({ 
        error: error instanceof Error ? error : new Error("Failed to load admin components"), 
        isLoading: false 
      });
    }
  }
}));
