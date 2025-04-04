
import { create } from "zustand";
import { ImpulseTheme } from "../types/impulse.types";
import { defaultImpulseTokens } from "../theme/impulse/tokens";
import { useThemeStore } from "@/stores/theme/store";
import { getLogger } from "@/logging";
import { safeDetails } from "@/logging/utils/safeDetails";
import { DEFAULT_THEME_NAME } from "@/utils/themeInitializer";
import { themeToImpulseTheme } from "@/admin/theme/utils/modelTransformers";
import { applyThemeToDocument } from "@/admin/theme/utils/themeApplicator";
import { LogCategory } from "@/logging/types";

const logger = getLogger('ImpulsivityStore', { category: LogCategory.THEME });

interface ImpulsivityThemeState {
  // Theme state
  theme: ImpulseTheme;
  isDirty: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  setTheme: (theme: Partial<ImpulseTheme>) => void;
  loadTheme: () => Promise<void>;
  saveTheme: () => Promise<void>;
  resetTheme: () => void;
}

// Main store with standardized naming - "Impulsivity"
export const useImpulsivityStore = create<ImpulsivityThemeState>((set, get) => ({
  // Initial state
  theme: defaultImpulseTokens,
  isDirty: false,
  isLoading: false,
  error: null,
  
  // Actions
  setTheme: (themeUpdates) => {
    try {
      // Get current theme
      const currentTheme = get().theme;
      
      // Create merged theme with updates
      const updatedTheme = { 
        ...currentTheme, 
        ...themeUpdates 
      } as ImpulseTheme;
      
      // Apply theme to document immediately
      applyThemeToDocument(updatedTheme);
      
      set({
        theme: updatedTheme,
        isDirty: true
      });
      
      logger.debug('Theme updated locally', {
        details: { updatedProperties: Object.keys(themeUpdates).join(', ') }
      });
    } catch (error) {
      logger.error('Error updating theme', {
        details: safeDetails(error)
      });
      
      // Don't change state on error
    }
  },
  
  loadTheme: async () => {
    try {
      set({ isLoading: true });
      logger.info(`Loading ${DEFAULT_THEME_NAME} theme`);
      
      const themeStore = useThemeStore.getState();
      
      // First try to use existing theme from the main store
      let { currentTheme } = themeStore;
      
      // If no theme in the store, try to hydrate it
      if (!currentTheme) {
        logger.debug('No current theme in store, hydrating');
        await themeStore.hydrateTheme();
        currentTheme = themeStore.currentTheme;
      }
      
      if (currentTheme) {
        // Convert to ImpulseTheme format
        const impulseTheme = themeToImpulseTheme(currentTheme);
        
        // Apply theme to document
        applyThemeToDocument(impulseTheme);
        
        set({
          theme: impulseTheme,
          isLoading: false,
          isDirty: false
        });
        
        logger.debug(`${DEFAULT_THEME_NAME} theme loaded successfully`);
      } else {
        // No theme in database, use defaults
        logger.warn(`No current theme found, using default ${DEFAULT_THEME_NAME} tokens`);
        
        // Apply default theme
        applyThemeToDocument(defaultImpulseTokens);
        
        set({ 
          theme: defaultImpulseTokens,
          isLoading: false,
          isDirty: false
        });
      }
    } catch (error) {
      logger.error(`Error loading ${DEFAULT_THEME_NAME} theme:`, {
        details: safeDetails(error)
      });
      
      // Apply default theme on error
      applyThemeToDocument(defaultImpulseTokens);
      
      set({ 
        error: error instanceof Error ? error : new Error("Failed to load theme"),
        theme: defaultImpulseTokens,
        isLoading: false
      });
    }
  },
  
  saveTheme: async () => {
    try {
      set({ isLoading: true });
      logger.info(`Saving ${DEFAULT_THEME_NAME} theme`);
      
      const themeStore = useThemeStore.getState();
      const { currentTheme } = themeStore;
      const { theme } = get();
      
      if (currentTheme?.id) {
        // Update existing theme
        const updatedDesignTokens = {
          ...currentTheme.design_tokens,
          admin: theme
        };
        
        // Update the theme in the main store
        themeStore.updateCurrentTheme({
          design_tokens: updatedDesignTokens
        });
        
        // Mark as clean after saving
        set({ 
          isDirty: false,
          isLoading: false
        });
        
        logger.debug(`${DEFAULT_THEME_NAME} theme saved successfully`);
      } else {
        throw new Error("No theme found to update");
      }
    } catch (error) {
      logger.error(`Error saving ${DEFAULT_THEME_NAME} theme:`, {
        details: safeDetails(error)
      });
      
      set({ 
        error: error instanceof Error ? error : new Error("Failed to save theme"),
        isLoading: false
      });
      
      throw error;
    }
  },
  
  resetTheme: () => {
    try {
      logger.info(`Resetting ${DEFAULT_THEME_NAME} theme to defaults`);
      
      // Apply default theme
      applyThemeToDocument(defaultImpulseTokens);
      
      set({ 
        theme: defaultImpulseTokens,
        isDirty: true
      });
      
      logger.debug(`${DEFAULT_THEME_NAME} theme reset to defaults`);
    } catch (error) {
      logger.error(`Error resetting ${DEFAULT_THEME_NAME} theme:`, {
        details: safeDetails(error)
      });
    }
  }
}));

// No longer exporting the old name to enforce consistency
