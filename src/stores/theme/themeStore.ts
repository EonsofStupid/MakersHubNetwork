
import { create } from "zustand";
import { Theme, ThemeScope, ThemeTokens, fallbackTokens, validateThemeTokens } from "@/theme/schema";
import { getLogger } from "@/logging";

// Logger for the theme store
const logger = getLogger();

export interface ThemeState {
  // Theme data
  tokens: ThemeTokens;
  scope: ThemeScope;
  currentTheme: Theme | null;
  
  // Loading state
  loadStatus: 'idle' | 'loading' | 'loaded' | 'error';
  error: Error | null;
  
  // Theme actions
  loadTheme: (scope?: ThemeScope) => Promise<void>;
  applyTokens: (tokens: Partial<ThemeTokens>) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Initial state with fallback tokens
  tokens: fallbackTokens,
  scope: 'app',
  currentTheme: null,
  loadStatus: 'idle',
  error: null,
  
  // Load theme from backend
  loadTheme: async (scope = 'app') => {
    // Don't reload if already loading
    if (get().loadStatus === 'loading') return;
    
    set({ loadStatus: 'loading' });
    
    try {
      logger.info('Loading theme', { details: { scope } });
      
      // Fetch theme data from Supabase edge function
      const response = await fetch(`https://kxeffcclfvecdvqpljbh.supabase.co/functions/v1/theme-service?scope=${scope}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load theme: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate tokens using Zod schema
      const validatedTokens = validateThemeTokens(data.tokens || {});
      
      set({ 
        tokens: validatedTokens,
        currentTheme: data.theme || null,
        scope, 
        loadStatus: 'loaded',
        error: null 
      });
      
      // Apply tokens to CSS variables
      applyTokensToDOM(validatedTokens);
      
      logger.info('Theme loaded successfully', {
        details: { scope, themeName: data.theme?.name || 'fallback' }
      });
    } catch (error) {
      logger.error('Failed to load theme', { 
        details: { scope, error: error instanceof Error ? error.message : String(error) }
      });
      
      // Fall back to default tokens on error
      set({ 
        tokens: fallbackTokens, 
        loadStatus: 'error',
        error: error instanceof Error ? error : new Error(String(error))
      });
      
      // Apply fallback tokens to CSS variables
      applyTokensToDOM(fallbackTokens);
    }
  },
  
  // Apply partial token updates (for theme editor)
  applyTokens: (tokenUpdates) => {
    const currentTokens = get().tokens;
    const updatedTokens = { ...currentTokens, ...tokenUpdates };
    
    // Validate the merged tokens
    const validatedTokens = validateThemeTokens(updatedTokens);
    
    set({ tokens: validatedTokens });
    applyTokensToDOM(validatedTokens);
  }
}));

// Helper function to apply tokens to DOM as CSS variables
function applyTokensToDOM(tokens: ThemeTokens): void {
  const root = document.documentElement;
  
  // Apply each token as a CSS variable
  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}
