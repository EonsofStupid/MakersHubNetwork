
import { create } from "zustand";
import { ImpulseTheme } from "../types/impulse.types";
import { defaultImpulseTokens } from "../theme/impulse/tokens";
import { useThemeStore } from "@/stores/theme/store";
import { getLogger } from "@/logging";
import { safeDetails } from "@/logging/utils/safeDetails";
import { DEFAULT_THEME_NAME } from "@/utils/themeInitializer";

const logger = getLogger('ImpulsivityStore');

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
    set((state) => ({
      theme: { ...state.theme, ...themeUpdates },
      isDirty: true
    }));
  },
  
  loadTheme: async () => {
    try {
      set({ isLoading: true });
      logger.info(`Loading ${DEFAULT_THEME_NAME} theme`);
      
      const themeStore = useThemeStore.getState();
      const { currentTheme } = themeStore;
      
      if (currentTheme) {
        // Extract admin-specific tokens
        const adminTokens = currentTheme.design_tokens?.admin || {};
        
        // Merge with defaults
        set({
          theme: {
            ...defaultImpulseTokens,
            ...adminTokens
          },
          isLoading: false
        });
        
        logger.debug(`${DEFAULT_THEME_NAME} theme loaded successfully`);
      } else {
        // No theme in database, use defaults
        logger.warn(`No current theme found, using default ${DEFAULT_THEME_NAME} tokens`);
        set({ 
          theme: defaultImpulseTokens,
          isLoading: false
        });
      }
    } catch (error) {
      logger.error(`Error loading ${DEFAULT_THEME_NAME} theme:`, {
        details: safeDetails(error)
      });
      
      set({ 
        error: error instanceof Error ? error : new Error("Failed to load theme"),
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
        
        await themeStore.setTheme(currentTheme.id);
        
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
    }
  },
  
  resetTheme: () => {
    logger.info(`Resetting ${DEFAULT_THEME_NAME} theme to defaults`);
    set({ 
      theme: defaultImpulseTokens,
      isDirty: true
    });
  }
}));

// No longer exporting the old name to enforce consistency
