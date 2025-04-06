
import { create } from "zustand";
import { Theme, ThemeContext, ThemeToken, ComponentTokens, ThemeLogDetails } from "@/types/theme";
import { ThemeTokens, fallbackTokens, validateThemeTokens } from "@/theme/schema";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging";
import { z } from "zod";

// Logger for the theme store
const logger = getLogger();

// Define a ZOD schema for theme validation
const themeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  is_default: z.boolean(),
  created_by: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  published_at: z.string().optional(),
  version: z.number(),
  cache_key: z.string().optional(),
  parent_theme_id: z.string().optional(),
  design_tokens: z.object({
    colors: z.record(z.unknown()).optional().default({}),
    spacing: z.record(z.unknown()).optional().default({}),
    typography: z.object({
      fontSizes: z.record(z.unknown()).optional().default({}),
      fontFamilies: z.record(z.unknown()).optional().default({}),
      lineHeights: z.record(z.unknown()).optional().default({}),
      letterSpacing: z.record(z.unknown()).optional().default({})
    }).optional().default({}),
    effects: z.object({
      shadows: z.record(z.unknown()).optional().default({}),
      blurs: z.record(z.unknown()).optional().default({}),
      gradients: z.record(z.unknown()).optional().default({}),
      primary: z.string().optional(),
      secondary: z.string().optional(),
      tertiary: z.string().optional()
    }).optional().default({}),
    animation: z.object({
      keyframes: z.record(z.unknown()).optional().default({}),
      transitions: z.record(z.unknown()).optional().default({}),
      durations: z.record(z.unknown()).optional().default({})
    }).optional().default({}),
    admin: z.record(z.unknown()).optional().default({})
  }).default({}),
  component_tokens: z.array(z.object({
    id: z.string(),
    component_name: z.string(),
    styles: z.record(z.unknown()),
    description: z.string().optional(),
    theme_id: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    context: z.enum(['site', 'admin', 'chat', 'app', 'training']).optional()
  })).default([]),
  composition_rules: z.record(z.unknown()).optional().default({}),
  cached_styles: z.record(z.unknown()).optional().default({})
});

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
      const logDetails: ThemeLogDetails = {
        category: LogCategory.UI,
        details: { context },
        source: 'ThemeStore'
      };
      
      logger.info('Loading theme', logDetails);
      
      // Fetch theme data from Supabase edge function - using context parameter
      const response = await fetch(`https://kxeffcclfvecdvqpljbh.supabase.co/functions/v1/theme-service?context=${context}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load theme: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate the theme with ZOD
      let validatedTheme: Theme | null = null;
      let validationFailed = false;
      
      try {
        if (data.theme) {
          const result = themeSchema.safeParse(data.theme);
          if (result.success) {
            validatedTheme = result.data as Theme;
          } else {
            validationFailed = true;
            logger.warn('Theme validation failed', {
              details: {
                errors: result.error.format(),
                theme: data.theme.name || 'unknown'
              }
            });
          }
        }
      } catch (validationError) {
        validationFailed = true;
        logger.error('Theme validation error', {
          details: { 
            error: validationError instanceof Error ? validationError.message : String(validationError),
            theme: data.theme?.name || 'unknown'
          }
        });
      }
      
      // If validation failed, create a sanitized version
      if (validationFailed && data.theme) {
        validatedTheme = {
          id: data.theme.id || `fallback-${Date.now()}`,
          name: data.theme.name || 'Fallback Theme',
          status: data.theme.status || 'published',
          is_default: Boolean(data.theme.is_default),
          created_at: data.theme.created_at || new Date().toISOString(),
          updated_at: data.theme.updated_at || new Date().toISOString(),
          version: data.theme.version || 1,
          design_tokens: {
            colors: data.theme.design_tokens?.colors || {},
            spacing: data.theme.design_tokens?.spacing || {},
            typography: data.theme.design_tokens?.typography || {
              fontSizes: {},
              fontFamilies: {},
              lineHeights: {},
              letterSpacing: {}
            },
            effects: {
              shadows: data.theme.design_tokens?.effects?.shadows || {},
              blurs: data.theme.design_tokens?.effects?.blurs || {},
              gradients: data.theme.design_tokens?.effects?.gradients || {},
              primary: data.theme.design_tokens?.effects?.primary || "#00F0FF",
              secondary: data.theme.design_tokens?.effects?.secondary || "#FF2D6E",
              tertiary: data.theme.design_tokens?.effects?.tertiary || "#8B5CF6"
            },
            animation: {
              keyframes: data.theme.design_tokens?.animation?.keyframes || {},
              transitions: data.theme.design_tokens?.animation?.transitions || {},
              durations: data.theme.design_tokens?.animation?.durations || {}
            },
            admin: data.theme.design_tokens?.admin || {}
          },
          component_tokens: Array.isArray(data.theme.component_tokens) ? 
            data.theme.component_tokens.map((token: any) => ({
              id: token.id || `comp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              component_name: token.component_name || 'unknown',
              styles: token.styles || {},
              description: token.description,
              theme_id: token.theme_id,
              created_at: token.created_at,
              updated_at: token.updated_at,
              context: token.context
            })) : []
        };
      }
      
      // Validate tokens using Zod schema
      const validatedTokens = validateThemeTokens(data.tokens || {});
      
      set({ 
        tokens: validatedTokens,
        currentTheme: validatedTheme || null,
        context, 
        loadStatus: 'loaded',
        error: null 
      });
      
      // Apply tokens to CSS variables
      applyTokensToDOM(validatedTokens);
      
      const successLogDetails: ThemeLogDetails = {
        category: LogCategory.SYSTEM,
        details: { 
          context, 
          themeName: validatedTheme?.name || 'fallback',
          isFallback: data.isFallback || false,
          validationFailed
        }
      };
      
      logger.info('Theme loaded successfully', successLogDetails);
    } catch (error) {
      const errorLogDetails: ThemeLogDetails = {
        category: LogCategory.SYSTEM,
        details: { 
          context, 
          error: error instanceof Error ? error.message : String(error) 
        }
      };
      
      logger.error('Failed to load theme', errorLogDetails);
      
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
      const logDetails: ThemeLogDetails = {
        category: LogCategory.UI,
        details: { themeId },
        source: 'ThemeStore'
      };
      
      logger.info('Setting theme by ID', logDetails);
      
      // Fetch theme data from API
      const response = await fetch(`https://kxeffcclfvecdvqpljbh.supabase.co/functions/v1/get-theme?id=${themeId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load theme: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.theme) {
        throw new Error('Theme not found');
      }
      
      // Process theme data and validate with ZOD
      const result = themeSchema.safeParse(data.theme);
      
      if (!result.success) {
        logger.warn('Theme validation failed when setting theme', {
          details: {
            errors: result.error.format(),
            themeId
          }
        });
        
        // Create a sanitized version
        const sanitizedTheme: Theme = {
          id: data.theme.id || `fallback-${Date.now()}`,
          name: data.theme.name || 'Fallback Theme',
          status: data.theme.status || 'published',
          is_default: Boolean(data.theme.is_default),
          created_at: data.theme.created_at || new Date().toISOString(),
          updated_at: data.theme.updated_at || new Date().toISOString(),
          version: data.theme.version || 1,
          design_tokens: {
            colors: data.theme.design_tokens?.colors || {},
            spacing: data.theme.design_tokens?.spacing || {},
            typography: data.theme.design_tokens?.typography || {
              fontSizes: {},
              fontFamilies: {},
              lineHeights: {},
              letterSpacing: {}
            },
            effects: {
              shadows: data.theme.design_tokens?.effects?.shadows || {},
              blurs: data.theme.design_tokens?.effects?.blurs || {},
              gradients: data.theme.design_tokens?.effects?.gradients || {},
              primary: data.theme.design_tokens?.effects?.primary || "#00F0FF",
              secondary: data.theme.design_tokens?.effects?.secondary || "#FF2D6E",
              tertiary: data.theme.design_tokens?.effects?.tertiary || "#8B5CF6"
            },
            animation: {
              keyframes: data.theme.design_tokens?.animation?.keyframes || {},
              transitions: data.theme.design_tokens?.animation?.transitions || {},
              durations: data.theme.design_tokens?.animation?.durations || {}
            },
            admin: data.theme.design_tokens?.admin || {}
          },
          component_tokens: Array.isArray(data.theme.component_tokens) ? 
            data.theme.component_tokens.map((token: any) => ({
              id: token.id || `comp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              component_name: token.component_name || 'unknown',
              styles: token.styles || {},
              description: token.description,
              theme_id: token.theme_id,
              created_at: token.created_at,
              updated_at: token.updated_at,
              context: token.context
            })) : []
        };
        
        // Extract tokens from theme design tokens
        const themeTokens: Partial<ThemeTokens> = {
          primary: sanitizedTheme.design_tokens.colors?.primary as string || fallbackTokens.primary,
          secondary: sanitizedTheme.design_tokens.colors?.secondary as string || fallbackTokens.secondary,
          background: sanitizedTheme.design_tokens.colors?.background as string || fallbackTokens.background,
          foreground: sanitizedTheme.design_tokens.colors?.foreground as string || fallbackTokens.foreground,
          // Add more token mappings as needed
        };
        
        // Update the store with the sanitized theme and tokens
        set({ 
          currentTheme: sanitizedTheme, 
          tokens: validateThemeTokens({...fallbackTokens, ...themeTokens}),
          loadStatus: 'loaded'
        });
        
        // Apply the tokens to the DOM
        applyTokensToDOM(get().tokens);
      } else {
        // Happy path - theme is valid
        const validTheme = result.data as Theme;
        
        // Extract tokens from theme design tokens
        const themeTokens: Partial<ThemeTokens> = {
          primary: validTheme.design_tokens.colors?.primary as string || fallbackTokens.primary,
          secondary: validTheme.design_tokens.colors?.secondary as string || fallbackTokens.secondary,
          background: validTheme.design_tokens.colors?.background as string || fallbackTokens.background,
          foreground: validTheme.design_tokens.colors?.foreground as string || fallbackTokens.foreground,
          // Add more token mappings as needed
        };
        
        // Update the store
        set({ 
          currentTheme: validTheme, 
          tokens: validateThemeTokens({...fallbackTokens, ...themeTokens}),
          loadStatus: 'loaded'
        });
        
        // Apply the tokens to the DOM
        applyTokensToDOM(get().tokens);
      }
      
      const successLogDetails: ThemeLogDetails = {
        category: LogCategory.SYSTEM,
        details: { themeId: data.theme.id, themeName: data.theme.name }
      };
      
      logger.info('Theme set successfully', successLogDetails);
    } catch (error) {
      const errorLogDetails: ThemeLogDetails = {
        category: LogCategory.SYSTEM,
        details: { 
          themeId,
          error: error instanceof Error ? error.message : String(error) 
        }
      };
      
      logger.error('Failed to set theme', errorLogDetails);
      
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
