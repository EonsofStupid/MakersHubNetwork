
import { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';

export interface ThemeVariables {
  theme: any | null;
  cssVariables: Record<string, string>;
  isLoaded: boolean;
  componentStyles?: Record<string, any>;
  animations?: Record<string, any>;
  variables?: {
    background?: string;
    foreground?: string;
    card?: string;
    cardForeground?: string;
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    muted?: string;
    mutedForeground?: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    destructiveForeground?: string;
    border?: string;
    input?: string;
    ring?: string;
    
    // Theme-specific variables
    effectColor?: string;
    effectSecondary?: string;
    effectTertiary?: string;
    
    // Transitions
    transitionFast?: string;
    transitionNormal?: string;
    transitionSlow?: string;
    animationFast?: string;
    animationNormal?: string;
    animationSlow?: string;
    
    // Radii
    radiusSm?: string;
    radiusMd?: string;
    radiusLg?: string;
    radiusFull?: string;
  };
}

// Hook to access theme variables in components
export function useSiteTheme(): ThemeVariables {
  const [cssVariables, setCssVariables] = useState<Record<string, string>>({});
  const themeStore = useThemeStore();
  const theme = themeStore.theme;
  const isLoaded = themeStore.isLoaded;
  const componentStyles = themeStore.componentStyles;
  const animations = themeStore.animations;

  useEffect(() => {
    if (theme) {
      // Extract CSS variables from the theme
      const vars: Record<string, string> = {};
      
      // Process all colors
      Object.entries(theme.colors || {}).forEach(([key, value]) => {
        vars[`--${key}`] = value as string;
      });
      
      setCssVariables(vars);
    }
  }, [theme]);

  // Extract specific theme variables for easy access
  const variables = {
    // Basic colors
    background: cssVariables['--background'],
    foreground: cssVariables['--foreground'],
    card: cssVariables['--card'],
    cardForeground: cssVariables['--card-foreground'],
    primary: cssVariables['--primary'],
    primaryForeground: cssVariables['--primary-foreground'],
    secondary: cssVariables['--secondary'],
    secondaryForeground: cssVariables['--secondary-foreground'],
    muted: cssVariables['--muted'],
    mutedForeground: cssVariables['--muted-foreground'],
    accent: cssVariables['--accent'],
    accentForeground: cssVariables['--accent-foreground'],
    destructive: cssVariables['--destructive'],
    destructiveForeground: cssVariables['--destructive-foreground'],
    border: cssVariables['--border'],
    input: cssVariables['--input'],
    ring: cssVariables['--ring'],
    
    // Theme-specific variables
    effectColor: cssVariables['--effect-color'],
    effectSecondary: cssVariables['--effect-secondary'],
    effectTertiary: cssVariables['--effect-tertiary'],
    
    // Transitions
    transitionFast: cssVariables['--transition-fast'],
    transitionNormal: cssVariables['--transition-normal'],
    transitionSlow: cssVariables['--transition-slow'],
    animationFast: cssVariables['--animation-fast'],
    animationNormal: cssVariables['--animation-normal'],
    animationSlow: cssVariables['--animation-slow'],
    
    // Radii
    radiusSm: cssVariables['--radius-sm'],
    radiusMd: cssVariables['--radius-md'],
    radiusLg: cssVariables['--radius-lg'],
    radiusFull: cssVariables['--radius-full'],
  };

  return { 
    theme, 
    cssVariables, 
    isLoaded, 
    componentStyles, 
    animations, 
    variables 
  };
}
