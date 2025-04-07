
import { supabase } from '@/integrations/supabase/client';
import { Theme, ThemeContext } from '@/types/theme';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

// Create a logger instance for the theme service
const logger = getLogger();

// Local fallback theme for when the database is unavailable
const fallbackTheme: Theme = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Local Fallback Theme",
  description: "Local emergency fallback theme used when theme service is unavailable",
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
};

interface GetThemeOptions {
  id?: string;
  name?: string;
  isDefault?: boolean;
  context?: ThemeContext;
  enableFallback?: boolean;
}

/**
 * Get a theme from the database
 */
export async function getTheme(options?: GetThemeOptions): Promise<{ theme: any; isFallback: boolean }> {
  try {
    logger.info("Fetching theme from service", {
      category: LogCategory.DATABASE,
      details: options
    });
    
    const { id, name, isDefault = true, context = 'site' } = options || {};
    
    // Use edge function to get theme - using URL parameters instead of body
    const { data, error } = await supabase.functions.invoke('theme-service', {
      // Don't use body for GET requests, use query string parameters instead
      method: 'GET',
      params: { 
        themeId: id,
        themeName: name,
        isDefault: isDefault ? 'true' : 'false',
        context 
      }
    });

    if (error) {
      logger.error("Error fetching theme from service", { 
        category: LogCategory.DATABASE,
        details: { error, options }
      });
      
      return { 
        theme: fallbackTheme, 
        isFallback: true 
      };
    }
    
    logger.info("Theme set successfully", { 
      category: LogCategory.DATABASE,
      details: {
        themeId: data.theme?.id || 'unknown',
        isFallback: data.isFallback || false,
        componentTokensCount: Array.isArray(data.theme?.component_tokens) ? data.theme?.component_tokens.length : 0
      }
    });

    return { 
      theme: data.theme, 
      isFallback: data.isFallback || false 
    };
    
  } catch (error) {
    logger.error("Error fetching theme from service", { 
      category: LogCategory.DATABASE,
      details: error instanceof Error ? error.message : String(error)
    });
    
    // Return local fallback theme as emergency backup
    return { 
      theme: fallbackTheme, 
      isFallback: true 
    };
  }
}

export async function fetchTheme(themeId: string): Promise<any> {
  try {
    logger.info("Fetching theme from service", {
      category: LogCategory.DATABASE,
      details: { themeId }
    });
    
    // Use GET params instead of body
    const { data, error } = await supabase.functions.invoke('theme-service', {
      method: 'GET',
      params: {
        themeId,
        context: 'site'
      }
    });

    if (error) {
      logger.error("Error fetching theme from service", { 
        category: LogCategory.DATABASE,
        details: { error, themeId }
      });
      
      return { 
        theme: fallbackTheme, 
        isFallback: true 
      };
    }
    
    logger.info("Theme set successfully", { 
      category: LogCategory.DATABASE,
      details: {
        themeId: data.theme?.id || 'unknown',
        isFallback: data.isFallback || false,
        componentTokensCount: Array.isArray(data.theme?.component_tokens) ? data.theme?.component_tokens.length : 0
      }
    });

    return { 
      theme: data.theme, 
      isFallback: data.isFallback || false 
    };
    
  } catch (error) {
    logger.error("Error fetching theme from service", { 
      category: LogCategory.DATABASE,
      details: error instanceof Error ? error.message : String(error)
    });
    
    // Return local fallback theme as emergency backup
    return { 
      theme: fallbackTheme, 
      isFallback: true 
    };
  }
}
