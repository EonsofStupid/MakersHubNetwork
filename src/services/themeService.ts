import { supabase } from "@/integrations/supabase/client";
import { Theme, ComponentTokens, DesignTokensStructure } from "@/types/theme";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging";
import { z } from "zod";
import { ThemeContext, ThemeLogDetails } from "@/types/theme";
import { PostgrestError } from '@supabase/supabase-js';
import { Json } from "@/integrations/supabase/types";

// Create a type-safe logger for the theme service
const logger = getLogger();

// Define Zod schemas for theme validation
const designTokensSchema = z.object({
  colors: z.record(z.string()).optional(),
  spacing: z.record(z.unknown()).optional(),
  typography: z.object({
    fontSizes: z.record(z.unknown()).optional(),
    fontFamilies: z.record(z.unknown()).optional(),
    lineHeights: z.record(z.unknown()).optional(),
    letterSpacing: z.record(z.unknown()).optional(),
  }).optional(),
  effects: z.object({
    shadows: z.record(z.unknown()).optional(),
    blurs: z.record(z.unknown()).optional(),
    gradients: z.record(z.unknown()).optional(),
    primary: z.string().optional(),
    secondary: z.string().optional(),
    tertiary: z.string().optional(),
  }).optional(),
  animation: z.object({
    keyframes: z.record(z.unknown()).optional(),
    transitions: z.record(z.unknown()).optional(),
    durations: z.record(z.string().or(z.number())).optional(),
  }).optional(),
  admin: z.record(z.unknown()).optional(),
});

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

const themeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  is_default: z.boolean().default(false),
  created_by: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  published_at: z.string().optional(),
  version: z.number(),
  cache_key: z.string().optional(),
  parent_theme_id: z.string().optional(),
  design_tokens: designTokensSchema,
  component_tokens: z.array(componentTokenSchema).optional(),
  composition_rules: z.record(z.unknown()).optional(),
  cached_styles: z.record(z.unknown()).optional(),
});

/**
 * Default fallback theme used when theme service fails
 */
const fallbackTheme: Theme = {
  id: "fallback-theme",
  name: "Fallback Theme",
  description: "Emergency fallback theme used when theme service is unavailable",
  status: "published",
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
      keyframes: {
        // MakersImpulse original animations
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" }
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)"
          },
          "100%": {
            opacity: "0",
            transform: "translateY(10px)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.95)", opacity: "0" }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" }
        },
        "footer-float": {
          "0%, 100%": {
            transform: "perspective(1000px) rotateX(1deg) translateY(0)"
          },
          "50%": {
            transform: "perspective(1000px) rotateX(2deg) translateY(-10px)"
          }
        },
        "footer-pulse": {
          "0%, 100%": {
            opacity: 0.8,
            boxShadow: "0 -8px 32px 0 rgba(0,240,255,0.2)"
          },
          "50%": {
            opacity: 1,
            boxShadow: "0 -12px 48px 0 rgba(0,240,255,0.3)"
          }
        },
        "cyber-particles": {
          "0%": { transform: "translateY(0) translateX(0)" },
          "25%": { transform: "translateY(-20px) translateX(10px)" },
          "50%": { transform: "translateY(0) translateX(20px)" },
          "75%": { transform: "translateY(20px) translateX(10px)" },
          "100%": { transform: "translateY(0) translateX(0)" }
        }
      },
      transitions: {},
      durations: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
        animationFast: "1s",
        animationNormal: "2s",
        animationSlow: "3s",
      }
    },
    spacing: {
      radius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        full: "9999px",
      }
    }
  },
  component_tokens: [],
  composition_rules: {},
  cached_styles: {}
};

/**
 * Validates a theme object using Zod
 */
function validateTheme(themeData: unknown): Theme {
  try {
    // Use Zod to validate the theme structure
    const validationResult = themeSchema.safeParse(themeData);
    
    if (validationResult.success) {
      return validationResult.data as Theme;
    } else {
      // Log validation errors for debugging
      logger.warn('Theme validation failed', { 
        details: { 
          errors: validationResult.error.format() 
        } 
      });
      
      // Try to salvage what we can from the theme data
      return mergeWithFallback(themeData as Partial<Theme>);
    }
  } catch (error) {
    logger.error('Failed to validate theme', { details: error });
    return fallbackTheme;
  }
}

/**
 * Merges a partial theme with the fallback theme
 */
function mergeWithFallback(partialTheme: Partial<Theme>): Theme {
  try {
    // Start with the fallback theme
    const mergedTheme: Theme = { ...fallbackTheme };
    
    // Merge with the partial theme where values exist
    if (partialTheme.id) mergedTheme.id = partialTheme.id;
    if (partialTheme.name) mergedTheme.name = partialTheme.name;
    if (partialTheme.description) mergedTheme.description = partialTheme.description;
    if (partialTheme.status) mergedTheme.status = partialTheme.status;
    if (partialTheme.is_default !== undefined) mergedTheme.is_default = partialTheme.is_default;
    if (partialTheme.created_by) mergedTheme.created_by = partialTheme.created_by;
    if (partialTheme.created_at) mergedTheme.created_at = partialTheme.created_at;
    if (partialTheme.updated_at) mergedTheme.updated_at = partialTheme.updated_at;
    if (partialTheme.published_at) mergedTheme.published_at = partialTheme.published_at;
    if (partialTheme.version) mergedTheme.version = partialTheme.version;
    if (partialTheme.cache_key) mergedTheme.cache_key = partialTheme.cache_key;
    if (partialTheme.parent_theme_id) mergedTheme.parent_theme_id = partialTheme.parent_theme_id;
    
    // Merge design tokens - handle nested structure
    if (partialTheme.design_tokens) {
      const designTokens = mergedTheme.design_tokens;
      
      // Ensure all required objects exist in effects
      const effects: NonNullable<DesignTokensStructure['effects']> = {
        shadows: {},
        blurs: {},
        gradients: {},
        ...designTokens.effects,
        ...partialTheme.design_tokens.effects
      };
      
      // Ensure proper keyframes structure
      const keyframes = {
        ...designTokens.animation?.keyframes,
        ...partialTheme.design_tokens.animation?.keyframes
      };
      
      // Ensure proper transitions structure
      const transitions = {
        ...designTokens.animation?.transitions,
        ...partialTheme.design_tokens.animation?.transitions
      };
      
      // Ensure proper durations structure
      const durations = {
        ...designTokens.animation?.durations,
        ...partialTheme.design_tokens.animation?.durations
      };
      
      // Build the merged design_tokens
      mergedTheme.design_tokens = { 
        ...designTokens,
        ...partialTheme.design_tokens,
        effects,
        animation: { 
          ...designTokens.animation,
          ...partialTheme.design_tokens.animation,
          keyframes,
          transitions,
          durations
        }
      };
    }
    
    // Handle component tokens safely
    if (Array.isArray(partialTheme.component_tokens)) {
      // Validate each component token
      const validatedTokens: ComponentTokens[] = [];
      
      for (const token of partialTheme.component_tokens) {
        try {
          const validatedToken = componentTokenSchema.parse(token);
          validatedTokens.push(validatedToken);
        } catch (err) {
          logger.warn('Invalid component token in merge', { details: { token, error: err } });
        }
      }
      
      mergedTheme.component_tokens = validatedTokens;
    }
    
    // Copy other properties
    if (partialTheme.composition_rules) {
      mergedTheme.composition_rules = partialTheme.composition_rules;
    }
    if (partialTheme.cached_styles) {
      mergedTheme.cached_styles = partialTheme.cached_styles;
    }
    
    return mergedTheme;
  } catch (error) {
    logger.error('Error merging theme with fallback', { details: error });
    return fallbackTheme;
  }
}

/**
 * Extract component styles for important landing page components
 */
function extractComponentStyles(): Array<{
  component_name: string;
  styles: Record<string, any>;
  description?: string;
  context: ThemeContext;
}> {
  // Component styles for various components that need to be in the database
  return [
    {
      component_name: 'MainNav',
      styles: {
        container: {
          base: 'fixed top-0 w-full z-50 transition-all duration-300',
          animated: 'animate-morph-header shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_0_30px_rgba(0,240,255,0.1)]'
        },
        header: 'bg-background/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,240,255,0.2)] border-b border-primary/30',
        logo: 'text-2xl font-bold text-cyber',
        dataStream: 'relative',
        dataStreamEffect: 'mainnav-data-stream',
        glitchParticles: 'mainnav-glitch-particles',
        nav: 'flex items-center gap-1 md:gap-2',
        navItem: 'px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group',
        navItemActive: 'text-primary',
        navItemActiveIndicator: 'absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-center',
        mobileToggle: 'block md:hidden'
      },
      context: 'site'
    },
    {
      component_name: 'Logo',
      styles: {
        container: 'relative text-2xl font-bold transition-all duration-1000 hover:translate-y-[-8px] group',
        text: 'relative z-10 flex items-center space-x-[1px]',
        letter: 'inline-block transition-all relative',
        letterActive: 'inline-block transition-all relative text-primary',
        glow: 'absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-[1500ms] rounded-full scale-150',
        hoverEffect: 'transform-gpu transition-all duration-500'
      },
      context: 'site'
    },
    {
      component_name: 'Footer',
      styles: {
        container: 'fixed bottom-0 left-0 right-0 w-full z-40 transition-all ease-in-out',
        base: 'bg-background/20 backdrop-blur-xl shadow-[0_-8px_32px_0_rgba(0,240,255,0.2)] border-t border-primary/30',
        transform: 'transform perspective(1000px) rotateX(1deg) clip-path polygon(0 100%, 100% 100%, 98% 0%, 2% 0%)',
        content: 'container mx-auto px-4 py-4',
        linksSection: 'grid grid-cols-2 md:grid-cols-4 gap-8',
        linkGroup: 'space-y-2',
        linkGroupTitle: 'text-sm font-semibold text-primary',
        linkItem: 'text-xs text-muted-foreground hover:text-primary transition-colors duration-200',
        copyrightSection: 'mt-8 pt-4 border-t border-primary/20 text-xs text-muted-foreground',
        socialIcons: 'flex mt-2 space-x-4'
      },
      context: 'site'
    },
    {
      component_name: 'AdminNav',
      styles: {
        container: 'fixed top-0 left-0 w-64 h-screen bg-background/90 border-r border-primary/20 backdrop-blur-md z-50 transition-all duration-300',
        header: 'h-16 flex items-center justify-between px-4 border-b border-primary/20',
        logo: 'text-xl font-bold text-primary',
        navSection: 'py-4 px-2',
        navTitle: 'text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2',
        navItem: 'flex items-center gap-3 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 my-1 transition-colors',
        navItemActive: 'text-primary bg-primary/10 font-medium',
        iconWrapper: 'flex items-center justify-center w-5 h-5',
        collapsedContainer: 'w-16',
        collapsedNavItem: 'flex items-center justify-center'
      },
      context: 'admin'
    }
  ];
}

/**
 * Fetches a theme via the service role function
 */
export async function getTheme(themeId?: string): Promise<{theme: Theme, isFallback: boolean}> {
  try {
    logger.info('Fetching theme', { details: { themeId: themeId || 'default' } });
    
    const { data, error } = await supabase.functions.invoke('theme-service', {
      body: {
        operation: 'get-theme',
        themeId: themeId || undefined,
        isDefault: !themeId,
        context: 'site',
      },
    });
    
    if (error) {
      logger.error('Error fetching theme from service', { details: error });
      return { theme: fallbackTheme, isFallback: true };
    }
    
    if (!data || !data.theme) {
      logger.error('No theme data returned from service', { details: data });
      return { theme: fallbackTheme, isFallback: true };
    }
    
    // Validate the theme data
    const validatedTheme = validateTheme(data.theme);
    
    // Ensure is_default is always a boolean, not undefined
    if (validatedTheme.is_default === undefined) {
      validatedTheme.is_default = false;
    }
    
    // Ensure effects has all required properties 
    if (!validatedTheme.design_tokens.effects) {
      validatedTheme.design_tokens.effects = {
        shadows: {},
        blurs: {},
        gradients: {}
      };
    } else {
      validatedTheme.design_tokens.effects.shadows = validatedTheme.design_tokens.effects.shadows || {};
      validatedTheme.design_tokens.effects.blurs = validatedTheme.design_tokens.effects.blurs || {};
      validatedTheme.design_tokens.effects.gradients = validatedTheme.design_tokens.effects.gradients || {};
    }
    
    logger.info('Theme fetched successfully', { 
      details: { 
        themeId: validatedTheme.id,
        isFallback: !!data.isFallback
      }
    });
    
    return {
      theme: validatedTheme,
      isFallback: !!data.isFallback
    };
  } catch (error) {
    logger.error('Failed to fetch theme', { details: error });
    return { theme: fallbackTheme, isFallback: true };
  }
}

/**
 * Updates a theme via the service role function (requires authentication)
 */
export async function updateTheme(themeId: string, theme: Partial<Theme>): Promise<Theme> {
  try {
    // Get user id from session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      throw new Error('Authentication required for theme updates');
    }
    
    const userId = sessionData.session.user.id;
    logger.info('Updating theme', { details: { themeId, userId } });
    
    const { data, error } = await supabase.functions.invoke('theme-service', {
      body: {
        operation: 'update-theme',
        themeId,
        theme,
        userId
      },
    });
    
    if (error) {
      logger.error('Error updating theme', { details: error });
      throw error;
    }
    
    if (!data || !data.theme) {
      logger.error('No theme data returned after update', { details: data });
      throw new Error('No theme data returned from service');
    }
    
    logger.info('Theme updated successfully', { details: { themeId: data.theme.id } });
    return validateTheme(data.theme);
  } catch (error) {
    logger.error('Failed to update theme', { details: error });
    throw error;
  }
}

/**
 * Creates a new theme via the service role function (requires authentication)
 */
export async function createTheme(theme: Partial<Theme>): Promise<Theme> {
  try {
    // Get user id from session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      throw new Error('Authentication required for theme creation');
    }
    
    const userId = sessionData.session.user.id;
    logger.info('Creating new theme', { details: { userId } });
    
    const { data, error } = await supabase.functions.invoke('theme-service', {
      body: {
        operation: 'create-theme',
        theme,
        userId
      },
    });
    
    if (error) {
      logger.error('Error creating theme', { details: error });
      throw error;
    }
    
    if (!data || !data.theme) {
      logger.error('No theme data returned after creation', { details: data });
      throw new Error('No theme data returned from service');
    }
    
    logger.info('Theme created successfully', { details: { themeId: data.theme.id } });
    return validateTheme(data.theme);
  } catch (error) {
    logger.error('Failed to create theme', { details: error });
    throw error;
  }
}

/**
 * Ensures a default theme exists
 */
export async function ensureDefaultTheme(): Promise<string | null> {
  try {
    logger.info('Ensuring default theme exists');
    
    // Try to get the default theme
    const { theme, isFallback } = await getTheme();
    
    // If we got a real theme (not the fallback), return its ID
    if (!isFallback && theme.id) {
      logger.info('Found existing default theme', { details: { id: theme.id } });
      return theme.id;
    }
    
    // If we're using the fallback, check if user is authenticated to create a real theme
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      logger.warn('No default theme found and not authenticated to create one');
      return null;
    }
    
    // Create a new default theme
    logger.info('Creating new default theme');
    const newTheme = await createTheme({
      name: 'Default Theme',
      description: 'The default system theme',
      status: 'published',
      is_default: true,
      version: 1,
      design_tokens: theme.design_tokens,
      component_tokens: [],
      composition_rules: {},
      cached_styles: {}
    });
    
    return newTheme.id;
  } catch (error) {
    logger.error('Failed to ensure default theme', { details: error });
    return null;
  }
}

/**
 * Safely update design tokens with new values
 */
function safeUpdateDesignTokens(existingTokens: Record<string, any> = {}, newValues: Record<string, any> = {}): Record<string, any> {
  return {
    ...existingTokens,
    ...newValues,
  };
}

/**
 * Convert PostgrestError to a proper log details object
 */
function formatPostgrestError(error: PostgrestError): ThemeLogDetails {
  return {
    error: true,
    errorMessage: error.message,
    errorCode: error.code,
    errorDetails: error.details,
    errorHint: error.hint
  };
}
