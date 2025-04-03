
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { ThemeState } from "./types";
import { Theme, ComponentTokens, ThemeToken } from "@/types/theme";
import { isValidUUID } from "@/logging/utils/type-guards";
import { getLogger } from "@/logging";
import { safeDetails } from "@/logging/utils/safeDetails";
import { DEFAULT_THEME_NAME } from "@/utils/themeInitializer";
import { LogCategory } from "@/logging";

// Create a logger instance for the theme store
const logger = getLogger('ThemeStore', { category: LogCategory.THEME });

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: null,
  themeTokens: [],
  themeComponents: [],
  adminComponents: [],
  isLoading: false,
  error: null,

  setTheme: async (themeId: string) => {
    try {
      // Validate UUID before attempting to fetch
      if (!themeId || !isValidUUID(themeId)) {
        const errorMsg = `Invalid theme ID format: ${themeId}`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }

      set({ isLoading: true, error: null });
      logger.info(`Loading theme: ${themeId}`);

      // Fetch the theme
      const { data: themeData, error: themeError } = await supabase
        .from('themes')
        .select('*')
        .eq('id', themeId)
        .single();

      if (themeError) {
        logger.error(`Error fetching theme: ${themeError.message}`, {
          details: safeDetails(themeError)
        });
        set({ 
          error: new Error(`Failed to load theme: ${themeError.message}`), 
          isLoading: false 
        });
        return;
      }

      if (!themeData) {
        const errorMsg = `No theme found with ID: ${themeId}`;
        logger.error(errorMsg);
        set({ 
          error: new Error(errorMsg), 
          isLoading: false 
        });
        return;
      }

      // Safely fetch theme tokens with proper type safety
      let tokens: ThemeToken[] = [];
      try {
        // Fetch component tokens
        const { data: tokensData, error: tokensError } = await supabase
          .from('theme_tokens')
          .select('*')
          .eq('theme_id', themeId);

        if (tokensError) {
          logger.warn(`Error fetching theme tokens, continuing with empty tokens: ${tokensError.message}`);
        } else {
          tokens = (tokensData as ThemeToken[]) || [];
        }
      } catch (err) {
        logger.warn('Error processing theme tokens', {
          details: safeDetails(err)
        });
      }

      // Fetch component styles with proper error handling
      let components: ComponentTokens[] = [];
      try {
        const { data: componentsData, error: componentsError } = await supabase
          .from('theme_components')
          .select('*')
          .eq('theme_id', themeId);

        if (componentsError) {
          logger.warn(`Error fetching theme components, continuing with empty components: ${componentsError.message}`);
        } else {
          components = (componentsData as ComponentTokens[]) || [];
        }
      } catch (err) {
        logger.warn('Error processing theme components', {
          details: safeDetails(err)
        });
      }

      // Extract admin components from theme data with proper type safety
      let adminComponents: ComponentTokens[] = [];
      if (themeData.component_tokens) {
        try {
          // Try to parse the component_tokens if it's a string
          const componentTokensData = typeof themeData.component_tokens === 'string' 
            ? JSON.parse(themeData.component_tokens) 
            : themeData.component_tokens;
            
          if (Array.isArray(componentTokensData)) {
            adminComponents = componentTokensData
              .filter(comp => comp && typeof comp === 'object' && comp.context === 'admin')
              .map(comp => ({
                id: comp.id || `comp-${Date.now()}`,
                component_name: comp.component_name || '',
                styles: comp.styles || {},
                description: comp.description || '',
                theme_id: comp.theme_id || themeId,
                context: 'admin',
                created_at: comp.created_at || new Date().toISOString(),
                updated_at: comp.updated_at || new Date().toISOString()
              }));
          }
        } catch (err) {
          logger.warn('Error extracting admin components from theme', {
            details: safeDetails(err)
          });
        }
      }

      // Convert Supabase data to Theme type with proper conversion
      const theme: Theme = {
        id: themeData.id,
        name: themeData.name || '',
        description: themeData.description || '',
        status: themeData.status || 'draft',
        is_default: themeData.is_default || false,
        created_by: themeData.created_by,
        created_at: themeData.created_at || '',
        updated_at: themeData.updated_at || '',
        published_at: themeData.published_at,
        version: themeData.version || 1,
        cache_key: themeData.cache_key,
        parent_theme_id: themeData.parent_theme_id,
        
        // Handle design_tokens: parse if string, otherwise use as-is
        design_tokens: typeof themeData.design_tokens === 'string' 
          ? JSON.parse(themeData.design_tokens) 
          : themeData.design_tokens || {},
          
        // Handle component_tokens: convert to ComponentTokens[] format
        component_tokens: adminComponents,
        
        // Handle composition_rules: parse if string, otherwise use as-is
        composition_rules: typeof themeData.composition_rules === 'string' 
          ? JSON.parse(themeData.composition_rules) 
          : themeData.composition_rules || {},
          
        // Handle cached_styles: parse if string, otherwise use as-is
        cached_styles: typeof themeData.cached_styles === 'string' 
          ? JSON.parse(themeData.cached_styles) 
          : themeData.cached_styles || {}
      };

      // Update state with all theme data
      set({
        currentTheme: theme,
        themeTokens: tokens,
        themeComponents: components,
        adminComponents,
        isLoading: false,
        error: null
      });

      logger.info(`Theme loaded successfully: ${themeData.name || themeId}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error loading theme');
      logger.error('Error in setTheme', { 
        details: safeDetails(err)
      });
      set({ error, isLoading: false });
    }
  },

  loadAdminComponents: async () => {
    try {
      const { currentTheme } = get();
      if (!currentTheme) {
        logger.warn('No current theme available for loading admin components');
        return;
      }

      // Extract admin components from the theme
      let adminComponents: ComponentTokens[] = [];
      if (currentTheme.component_tokens && Array.isArray(currentTheme.component_tokens)) {
        adminComponents = currentTheme.component_tokens;
      }

      set({ adminComponents });
      logger.info('Admin components loaded successfully');
    } catch (err) {
      logger.error('Error loading admin components', {
        details: safeDetails(err)
      });
    }
  },

  clearTheme: () => {
    set({
      currentTheme: null,
      themeTokens: [],
      themeComponents: [],
      adminComponents: [],
      isLoading: false,
      error: null
    });
  }
}));
