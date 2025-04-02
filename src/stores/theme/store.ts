
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { ThemeState } from "./types";
import { Theme, ComponentTokens } from "@/types/theme";
import { isValidUUID } from "@/logging/utils/type-guards";
import { getLogger } from "@/logging";
import { safeDetails } from "@/logging/utils/safeDetails";
import { DEFAULT_THEME_NAME } from "@/utils/themeInitializer";

// Create a logger instance for the theme store
const logger = getLogger('ThemeStore');

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

      // Safely access theme tokens with proper type safety
      let tokens: any[] = [];
      try {
        // Fetch component tokens
        const { data: tokensData, error: tokensError } = await supabase
          .from('theme_tokens')
          .select('*')
          .eq('theme_id', themeId);

        if (tokensError) {
          logger.warn(`Error fetching theme tokens, continuing with empty tokens: ${tokensError.message}`);
        } else {
          tokens = tokensData || [];
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
          components = componentsData || [];
        }
      } catch (err) {
        logger.warn('Error processing theme components', {
          details: safeDetails(err)
        });
      }

      // Extract admin components with proper type safety
      let adminComponents: ComponentTokens[] = [];
      if (themeData.component_tokens && Array.isArray(themeData.component_tokens)) {
        try {
          adminComponents = themeData.component_tokens.filter(
            comp => comp && typeof comp === 'object' && comp.context === 'admin'
          );
        } catch (err) {
          logger.warn('Error extracting admin components from theme', {
            details: safeDetails(err)
          });
        }
      }

      // Update state with all theme data
      set({
        currentTheme: themeData as Theme,
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
        adminComponents = currentTheme.component_tokens.filter(
          comp => comp && typeof comp === 'object' && comp.context === 'admin'
        );
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
