
import { create } from "zustand";
import { Theme, ThemeContext, ThemeToken, ComponentTokens } from "@/types/theme";
import { ThemeTokens, fallbackTokens, validateThemeTokens } from "@/theme/schema";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging";

// Logger for the theme store
const logger = getLogger();

export interface ThemeState {
  // Theme data
  tokens: ThemeTokens;
  context: ThemeContext;
  currentTheme: Theme | null;
  
  // Loading state
  loadStatus: 'idle' | 'loading' | 'loaded' | 'error';
  error: Error | null;
  
  // Theme actions
  loadTheme: (context?: ThemeContext) => Promise<void>;
  applyTokens: (tokens: Partial<ThemeTokens>) => void;
  setTheme: (themeId: string) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Initial state with fallback tokens
  tokens: fallbackTokens,
  context: 'app',
  currentTheme: null,
  loadStatus: 'idle',
  error: null,
  
  // Load theme from backend
  loadTheme: async (context = 'app') => {
    // Don't reload if already loading
    if (get().loadStatus === 'loading') return;
    
    set({ loadStatus: 'loading' });
    
    try {
      logger.info('Loading theme', { 
        category: LogCategory.UI,
        details: { context },
        source: 'ThemeStore'
      });
      
      // Fetch theme data from Supabase edge function - using context parameter
      const response = await fetch(`https://kxeffcclfvecdvqpljbh.supabase.co/functions/v1/theme-service?context=${context}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load theme: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate tokens using Zod schema
      const validatedTokens = validateThemeTokens(data.tokens || {});
      
      set({ 
        tokens: validatedTokens,
        currentTheme: data.theme || null,
        context, 
        loadStatus: 'loaded',
        error: null 
      });
      
      // Apply tokens to CSS variables
      applyTokensToDOM(validatedTokens);
      
      logger.info('Theme loaded successfully', {
        category: LogCategory.SYSTEM,
        details: { 
          context, 
          themeName: data.theme?.name || 'fallback',
          isFallback: data.isFallback || false
        }
      });
    } catch (error) {
      logger.error('Failed to load theme', { 
        category: LogCategory.SYSTEM,
        details: { 
          context, 
          error: error instanceof Error ? error.message : String(error) 
        }
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
  },
  
  // Update the entire theme by ID
  setTheme: async (themeId: string) => {
    set({ loadStatus: 'loading' });
    try {
      logger.info('Setting theme by ID', { 
        category: LogCategory.UI,
        details: { themeId },
        source: 'ThemeStore'
      });
      
      // Fetch theme data from API
      const response = await fetch(`https://kxeffcclfvecdvqpljbh.supabase.co/functions/v1/get-theme?id=${themeId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load theme: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.theme) {
        throw new Error('Theme not found');
      }
      
      // Process theme data
      const theme: Theme = data.theme;
      
      // Extract tokens from theme design tokens
      const themeTokens: Partial<ThemeTokens> = {
        primary: theme.design_tokens.colors?.primary || fallbackTokens.primary,
        secondary: theme.design_tokens.colors?.secondary || fallbackTokens.secondary,
        background: theme.design_tokens.colors?.background || fallbackTokens.background,
        foreground: theme.design_tokens.colors?.foreground || fallbackTokens.foreground,
        // Add more token mappings here
      };
      
      // Update the store with the new theme and tokens
      set({ 
        currentTheme: theme, 
        tokens: validateThemeTokens({...fallbackTokens, ...themeTokens}),
        loadStatus: 'loaded'
      });
      
      // Apply the tokens to the DOM
      applyTokensToDOM(get().tokens);
      
      logger.info('Theme set successfully', { 
        category: LogCategory.SYSTEM,
        details: { themeId: theme.id, themeName: theme.name }
      });
    } catch (error) {
      logger.error('Failed to set theme', { 
        category: LogCategory.SYSTEM,
        details: { 
          themeId,
          error: error instanceof Error ? error.message : String(error) 
        }
      });
      
      set({ 
        loadStatus: 'error',
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
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
