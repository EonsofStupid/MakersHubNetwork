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
const logger = getLogger('ThemeStore', LogCategory.SYSTEM);

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
        details: { themeIdOrName } as Record<string, unknown>
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
          version: Number(fetchedTheme.version || 1),
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
              logger.warn('Invalid component token found', { details: { token, error: err } });
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
        details: { 
          themeId: fetchedTheme.id, 
          isFallback, 
          componentTokensCount: Array.isArray(fetchedTheme.component_tokens) ? fetchedTheme.component_tokens.length : 0 
        } as Record<string, unknown>
      });
    } catch (error) {
      logger.error("Error fetching theme", { 
        details: error as Record<string, unknown>
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
        details: { errorMessage: error instanceof Error ? error.message : String(error) } as Record<string, unknown>
      });
    }
  },

  loadAdminComponents: async () => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Loading admin components');
      
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
            logger.warn('Invalid admin component token found', { details: { token, error: err } });
          }
        }
      }
      
      set({ adminComponents: validatedAdminComponents, isLoading: false });
      logger.info('Admin components loaded', { 
        details: { count: validatedAdminComponents.length } as Record<string, unknown>
      });
    } catch (error) {
      logger.error("Error loading admin components", { 
        details: error as Record<string, unknown>
      });
      set({ 
        error: error instanceof Error ? error : new Error("Failed to load admin components"), 
        isLoading: false 
      });
    }
  }
}));
