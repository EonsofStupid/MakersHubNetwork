import { create } from "zustand";
import { ThemeState } from "./types";
import { ComponentTokens, ThemeContext } from "@/types/theme";
import { getTheme } from "@/services/themeService";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging";
import { z } from "zod";

// Create a Zod schema for component tokens validation with proper ThemeContext
const componentTokenSchema = z.object({
  id: z.string(),
  component_name: z.string(),
  styles: z.record(z.unknown()),
  description: z.string().optional(),
  theme_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  context: z.enum(['site', 'admin', 'chat']).optional(),
});

// Enhanced theme schema to catch all issues
const designTokensSchema = z.object({
  colors: z.record(z.unknown()).optional().default({}),
  spacing: z.record(z.unknown()).optional().default({}),
  typography: z.object({
    fontSizes: z.record(z.unknown()).optional().default({}),
    fontFamilies: z.record(z.unknown()).optional().default({}),
    lineHeights: z.record(z.unknown()).optional().default({}),
    letterSpacing: z.record(z.unknown()).optional().default({}),
  }).optional().default({}),
  effects: z.object({
    shadows: z.record(z.unknown()).optional().default({}),
    blurs: z.record(z.unknown()).optional().default({}),
    gradients: z.record(z.unknown()).optional().default({}),
    primary: z.string().optional(),
    secondary: z.string().optional(),
    tertiary: z.string().optional(),
  }).optional().default({
    shadows: {},
    blurs: {},
    gradients: {}
  }),
  animation: z.object({
    keyframes: z.record(z.unknown()).optional().default({}),
    transitions: z.record(z.unknown()).optional().default({}),
    durations: z.record(z.union([z.string(), z.number()])).optional().default({}),
  }).optional().default({
    keyframes: {},
    transitions: {},
    durations: {}
  }),
  admin: z.record(z.unknown()).optional().default({}),
}).default({});

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
  design_tokens: designTokensSchema,
  component_tokens: z.array(componentTokenSchema).optional().default([]),
  composition_rules: z.record(z.unknown()).optional().default({}),
  cached_styles: z.record(z.unknown()).optional().default({}),
});

// Create a type-safe logger for the theme store
const logger = getLogger();

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: null,
  themeTokens: [],
  themeComponents: [],
  adminComponents: [],
  isLoading: false,
  error: null,

  setTheme: async (themeIdOrName: string) => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Setting theme', { 
        category: LogCategory.UI,
        details: { themeIdOrName },
        source: 'ThemeStore'
      });
      
      // We receive a theme ID or name, fetch the theme
      const { theme: fetchedTheme, isFallback } = await getTheme({
        id: themeIdOrName,
        name: themeIdOrName,
        enableFallback: true
      });
      
      if (!fetchedTheme || typeof fetchedTheme !== 'object') {
        throw new Error('Invalid theme data received');
      }

      // Validate the theme with Zod schema
      const validationResult = themeSchema.safeParse(fetchedTheme);
      
      if (!validationResult.success) {
        // Log validation errors
        logger.warn('Theme validation failed', { 
          category: LogCategory.SYSTEM,
          details: { 
            errors: validationResult.error.format(),
            themeId: themeIdOrName 
          } 
        });
        
        // Still continue with safe defaults
        // We'll create a sanitized version with defaults applied
        const sanitizedTheme = {
          ...fetchedTheme,
          is_default: Boolean(fetchedTheme.is_default),
          design_tokens: {
            colors: fetchedTheme.design_tokens?.colors || {},
            spacing: fetchedTheme.design_tokens?.spacing || {},
            typography: fetchedTheme.design_tokens?.typography || {
              fontSizes: {},
              fontFamilies: {},
              lineHeights: {},
              letterSpacing: {}
            },
            effects: {
              shadows: fetchedTheme.design_tokens?.effects?.shadows || {},
              blurs: fetchedTheme.design_tokens?.effects?.blurs || {},
              gradients: fetchedTheme.design_tokens?.effects?.gradients || {},
              primary: fetchedTheme.design_tokens?.effects?.primary || "#00F0FF",
              secondary: fetchedTheme.design_tokens?.effects?.secondary || "#FF2D6E",
              tertiary: fetchedTheme.design_tokens?.effects?.tertiary || "#8B5CF6"
            },
            animation: {
              keyframes: fetchedTheme.design_tokens?.animation?.keyframes || {},
              transitions: fetchedTheme.design_tokens?.animation?.transitions || {},
              durations: fetchedTheme.design_tokens?.animation?.durations || {}
            },
            admin: fetchedTheme.design_tokens?.admin || {}
          },
          component_tokens: Array.isArray(fetchedTheme.component_tokens) ? fetchedTheme.component_tokens : []
        };
        
        // Validate component tokens and sanitize
        const validatedComponentTokens: ComponentTokens[] = [];
        
        if (Array.isArray(sanitizedTheme.component_tokens)) {
          for (const token of sanitizedTheme.component_tokens) {
            try {
              // Ensure the context is valid ThemeContext before passing to validation
              const tokenToValidate = {
                ...token,
                context: token.context as ThemeContext | undefined
              };
              
              const validatedToken = componentTokenSchema.parse(tokenToValidate);
              validatedComponentTokens.push(validatedToken as ComponentTokens);
            } catch (err) {
              logger.warn('Invalid component token found', { 
                category: LogCategory.SYSTEM,
                details: { token, error: err } 
              });
            }
          }
        }
        
        set({ 
          currentTheme: { 
            ...sanitizedTheme, 
            component_tokens: validatedComponentTokens 
          }, 
          isLoading: false 
        });
      } else {
        // Theme is valid, set it in the store
        set({ 
          currentTheme: validationResult.data, 
          isLoading: false 
        });
      }
      
      logger.info('Theme set successfully', { 
        category: LogCategory.SYSTEM,
        details: { 
          themeId: fetchedTheme.id, 
          isFallback, 
          componentTokensCount: Array.isArray(fetchedTheme.component_tokens) ? fetchedTheme.component_tokens.length : 0 
        },
        source: 'ThemeStore'
      });
    } catch (error) {
      logger.error("Error fetching theme", { 
        category: LogCategory.SYSTEM,
        details: error,
        source: 'ThemeStore'
      });
      
      // On error, set a basic hardcoded fallback theme to ensure UI doesn't break
      set({
        currentTheme: {
          id: "fallback-theme-" + Date.now(),
          name: "Emergency Fallback Theme",
          description: "Fallback theme used when theme loading fails",
          status: 'published',
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          design_tokens: {
            colors: {
              background: "#080F1E",
              foreground: "#F9FAFB",
              card: "#0E172A",
              cardForeground: "#F9FAFB", 
              primary: "#00F0FF",
              primaryForeground: "#F9FAFB",
              secondary: "#FF2D6E",
              secondaryForeground: "#F9FAFB",
              muted: "#131D35",
              mutedForeground: "#94A3B8",
              accent: "#131D35",
              accentForeground: "#F9FAFB",
              destructive: "#EF4444",
              destructiveForeground: "#F9FAFB",
              border: "#131D35",
              input: "#131D35",
              ring: "#1E293B",
            },
            effects: {
              shadows: {},
              blurs: {},
              gradients: {},
              primary: "#00F0FF",
              secondary: "#FF2D6E",
              tertiary: "#8B5CF6",
            },
            animation: {
              keyframes: {},
              transitions: {},
              durations: {
                fast: "150ms",
                normal: "300ms",
                slow: "500ms",
                animationFast: "1s",
                animationNormal: "2s",
                animationSlow: "3s",
              }
            }
          },
          component_tokens: [],
        },
        error: error instanceof Error ? error : new Error("Failed to fetch theme"), 
        isLoading: false 
      });
      
      logger.warn("Using hardcoded fallback theme due to error", { 
        category: LogCategory.SYSTEM,
        details: { errorMessage: error instanceof Error ? error.message : String(error) }
      });
    }
  },

  loadAdminComponents: async () => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Loading admin components', {
        category: LogCategory.UI,
        source: 'ThemeStore'
      });
      
      // Use the theme service to get admin components
      const { theme: adminTheme } = await getTheme();
      
      // Validate and filter admin components
      const validatedAdminComponents: ComponentTokens[] = [];
      
      if (Array.isArray(adminTheme.component_tokens)) {
        for (const token of adminTheme.component_tokens) {
          try {
            // Ensure the context is valid ThemeContext before passing to validation
            const tokenToValidate = {
              ...token,
              context: token.context as ThemeContext | undefined
            };
            
            const validatedToken = componentTokenSchema.parse(tokenToValidate);
            if (validatedToken.context === 'admin') {
              validatedAdminComponents.push(validatedToken as ComponentTokens);
            }
          } catch (err) {
            logger.warn('Invalid admin component token found', { 
              category: LogCategory.SYSTEM,
              details: { token, error: err } 
            });
          }
        }
      }
      
      set({ adminComponents: validatedAdminComponents, isLoading: false });
      logger.info('Admin components loaded', { 
        category: LogCategory.UI,
        details: { count: validatedAdminComponents.length },
        source: 'ThemeStore'
      });
    } catch (error) {
      logger.error("Error loading admin components", { 
        category: LogCategory.SYSTEM,
        details: error,
        source: 'ThemeStore'
      });
      set({ 
        error: error instanceof Error ? error : new Error("Failed to load admin components"), 
        isLoading: false 
      });
    }
  },

  // Modified theme loading function to avoid re-loading when already loading
  loadTheme: async (context = 'app') => {
    // Don't reload if already loading
    if (get().loadStatus === 'loading') return;
    
    // Set loading status and proceed with loading
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
              },
              category: LogCategory.SYSTEM
            });
          }
        }
      } catch (validationError) {
        validationFailed = true;
        logger.error('Theme validation error', {
          details: { 
            error: validationError instanceof Error ? validationError.message : String(validationError),
            theme: data.theme?.name || 'unknown'
          },
          category: LogCategory.SYSTEM
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
      
      logger.info('Theme loaded successfully', {
        category: LogCategory.SYSTEM,
        details: { 
          context, 
          themeName: validatedTheme?.name || 'fallback',
          isFallback: data.isFallback || false,
          validationFailed
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
      
      // Process theme data and validate with ZOD
      const result = themeSchema.safeParse(data.theme);
      
      if (!result.success) {
        logger.warn('Theme validation failed when setting theme', {
          details: {
            errors: result.error.format(),
            themeId
          },
          category: LogCategory.SYSTEM
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
      
      logger.info('Theme set successfully', {
        category: LogCategory.SYSTEM,
        details: { themeId: data.theme.id, themeName: data.theme.name }
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
    root.style.setProperty(`--${key}`, String(value));
  });
}
