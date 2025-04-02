
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { ThemeState } from "./types";
import { Theme, ComponentTokens } from "@/types/theme";
import { isValidUUID } from "@/logging/utils/type-guards";
import { getLogger } from "@/logging";
import { safeDetails } from "@/logging/utils/safeDetails";

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
        logger.error("Database error fetching theme:", { details: safeDetails(error) });
        throw error;
      }
      
      if (!themes || themes.length === 0) {
        logger.error("No theme found for ID:", { details: { themeId } });
        throw new Error(`No theme found for ID: ${themeId}`);
      }

      // Simplify the theme conversion logic
      const rawTheme = themes[0];
      logger.debug("Raw theme data received", { details: { id: rawTheme.id, name: rawTheme.name } });
      
      // Initialize with default empty arrays for safety
      const componentTokens: ComponentTokens[] = [];
      
      // Get component tokens in a separate query to avoid RLS issues
      try {
        const { data: dbComponentTokens, error: componentError } = await supabase
          .from("theme_components")
          .select("*")
          .eq("theme_id", themeId);
  
        if (!componentError && dbComponentTokens && Array.isArray(dbComponentTokens)) {
          // Map components to the correct structure
          dbComponentTokens.forEach(token => {
            if (token && token.id) {
              componentTokens.push({
                id: token.id,
                component_name: token.component_name || '',
                styles: token.styles || {},
                theme_id: token.theme_id || undefined,
                context: token.context || undefined,
                created_at: token.created_at || '',
                updated_at: token.updated_at || '',
                description: '',
              });
            }
          });
        } else {
          logger.warn("No component tokens found or error fetching them:", { 
            details: safeDetails(componentError) 
          });
        }
      } catch (compErr) {
        logger.error("Error processing component tokens:", { details: safeDetails(compErr) });
        // Continue without component tokens rather than failing completely
      }
      
      // Ensure we have valid objects for the theme
      const designTokens = rawTheme.design_tokens && typeof rawTheme.design_tokens === 'object' 
        ? rawTheme.design_tokens as Record<string, any>
        : {};
        
      const compositionRules = rawTheme.composition_rules && typeof rawTheme.composition_rules === 'object'
        ? rawTheme.composition_rules as Record<string, any>
        : {};
        
      const cachedStyles = rawTheme.cached_styles && typeof rawTheme.cached_styles === 'object'
        ? rawTheme.cached_styles as Record<string, any>
        : {};

      // Create a theme object with safe defaults for all properties
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
        component_tokens: componentTokens,
        composition_rules: compositionRules,
        cached_styles: cachedStyles,
      };

      logger.info("Theme loaded successfully", { details: { id: theme.id, name: theme.name } });
      set({ currentTheme: theme, isLoading: false });
    } catch (error) {
      logger.error("Error fetching theme:", { details: safeDetails(error) });
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
        logger.error("Database error loading admin components:", { details: safeDetails(error) });
        throw error;
      }

      // Map them to our expected format with safe defaults
      const components: ComponentTokens[] = data.map(comp => ({
        id: comp.id,
        component_name: comp.component_name || '',
        styles: comp.styles as Record<string, any> || {},
        description: '', 
        theme_id: comp.theme_id || undefined,
        context: comp.context || undefined,
        created_at: comp.created_at || '',
        updated_at: comp.updated_at || ''
      }));

      logger.info(`Loaded ${components.length} admin components`);
      set({ adminComponents: components, isLoading: false });
    } catch (error) {
      logger.error("Error loading admin components:", { details: safeDetails(error) });
      set({ 
        error: error instanceof Error ? error : new Error("Failed to load admin components"), 
        isLoading: false 
      });
    }
  }
}));
