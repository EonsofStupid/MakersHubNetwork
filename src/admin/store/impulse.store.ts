import { create } from "zustand";
import { ImpulseTheme } from "../types/impulse.types";
import { defaultImpulseTokens } from "../theme/impulse/tokens";
import { useThemeStore } from "@/stores/theme/store";

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

// Renamed to useImpulsivityStore for consistency
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
      } else {
        // No theme in database, use defaults
        set({ 
          theme: defaultImpulseTokens,
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error loading Impulsivity theme:", error);
      set({ 
        error: error instanceof Error ? error : new Error("Failed to load theme"),
        isLoading: false
      });
    }
  },
  
  saveTheme: async () => {
    try {
      set({ isLoading: true });
      
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
      } else {
        throw new Error("No theme found to update");
      }
    } catch (error) {
      console.error("Error saving Impulsivity theme:", error);
      set({ 
        error: error instanceof Error ? error : new Error("Failed to save theme"),
        isLoading: false
      });
    }
  },
  
  resetTheme: () => {
    set({ 
      theme: defaultImpulseTokens,
      isDirty: true
    });
  }
}));

// Keep backward compatibility with the old name
export const useImpulseStore = useImpulsivityStore;
