
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { defaultImpulseTokens } from '../impulse/tokens';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

// Define utility classes for easier theme usage
const initialUtilityClasses = {
  text: {
    primary: 'text-[#00F0FF]',
    secondary: 'text-[#FF2D6E]',
    accent: 'text-[#8B5CF6]',
    foreground: 'text-[#F6F6F7]',
    muted: 'text-[rgba(255,255,255,0.7)]'
  },
  bg: {
    primary: 'bg-[#00F0FF]',
    secondary: 'bg-[#FF2D6E]',
    accent: 'bg-[#8B5CF6]',
    card: 'bg-[rgba(28,32,42,0.7)]',
    dark: 'bg-[#12121A]'
  },
  border: {
    primary: 'border-[#00F0FF]',
    secondary: 'border-[#FF2D6E]',
    accent: 'border-[#8B5CF6]',
    light: 'border-[rgba(255,255,255,0.2)]',
    dark: 'border-[rgba(0,0,0,0.2)]'
  },
  animation: {
    glow: 'animate-pulse-glow',
    pulse: 'animate-pulse-slow',
    float: 'animate-float',
    scan: 'animate-scan-line'
  },
  effect: {
    glow: 'shadow-[0_0_10px_rgba(0,240,255,0.5)]',
    neon: 'shadow-[0_0_5px_#00F0FF,0_0_10px_rgba(0,240,255,0.5)]',
    glass: 'backdrop-blur-xl bg-[rgba(28,32,42,0.7)] border-[rgba(255,255,255,0.1)]'
  }
};

// Context interface
interface AdminThemeContextType {
  theme: ImpulseTheme;
  isDark: boolean;
  isLoading: boolean;
  utilityClasses: typeof initialUtilityClasses;
  setTheme: (theme: ImpulseTheme) => void;
}

// Create the context with a default value
const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: defaultImpulseTokens,
  isDark: true,
  isLoading: true,
  utilityClasses: initialUtilityClasses,
  setTheme: () => {}
});

// Provider component
export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ImpulseTheme>(defaultImpulseTokens);
  const [isDark, setIsDark] = useState(true);
  const { isLoading: storeLoading } = useThemeStore();
  const logger = useLogger('AdminThemeProvider', { category: LogCategory.THEME });

  // Update utility classes when theme changes
  const [utilityClasses, setUtilityClasses] = useState(initialUtilityClasses);

  useEffect(() => {
    // Generate utility classes based on current theme
    try {
      if (theme) {
        const newUtilityClasses = {
          text: {
            primary: `text-[${theme.colors.primary}]`,
            secondary: `text-[${theme.colors.secondary}]`,
            accent: `text-[${theme.colors.accent || '#8B5CF6'}]`,
            foreground: `text-[${theme.colors.text.primary}]`,
            muted: `text-[${theme.colors.text.muted}]`
          },
          bg: {
            primary: `bg-[${theme.colors.primary}]`,
            secondary: `bg-[${theme.colors.secondary}]`,
            accent: `bg-[${theme.colors.accent || '#8B5CF6'}]`,
            card: `bg-[${theme.colors.background.card}]`,
            dark: `bg-[${theme.colors.background.main}]`
          },
          border: {
            primary: `border-[${theme.colors.primary}]`,
            secondary: `border-[${theme.colors.secondary}]`,
            accent: `border-[${theme.colors.accent || '#8B5CF6'}]`,
            light: `border-[${theme.colors.borders.normal}]`,
            dark: `border-[${theme.colors.borders.active}]`
          },
          animation: {
            glow: 'animate-pulse-glow',
            pulse: 'animate-pulse-slow',
            float: 'animate-float',
            scan: 'animate-scan-line'
          },
          effect: {
            glow: `shadow-[0_0_10px_${theme.effects.glow.primary}]`,
            neon: `shadow-[0_0_5px_${theme.colors.primary},0_0_10px_${theme.effects.glow.primary}]`,
            glass: `backdrop-blur-xl bg-[${theme.colors.background.overlay}] border-[${theme.colors.borders.normal}]`
          }
        };
        
        setUtilityClasses(newUtilityClasses);
        logger.debug('Admin theme utility classes updated');
      }
    } catch (error) {
      logger.error('Error updating admin theme utility classes', { 
        details: { error: String(error) } 
      });
    }
  }, [theme, logger]);

  // Effect to determine if theme is dark
  useEffect(() => {
    // Simple check if background color is dark
    try {
      const bgColor = theme.colors.background.main;
      const isColorDark = (color: string) => {
        // Simple heuristic - not perfect but works for most cases
        return color.includes('#1') || color.includes('#0') || color.includes('rgba(0') || color.includes('rgba(1');
      };
      
      setIsDark(isColorDark(bgColor));
    } catch (error) {
      // Default to dark for safety
      setIsDark(true);
    }
  }, [theme]);

  const value = {
    theme,
    isDark,
    isLoading: storeLoading,
    utilityClasses,
    setTheme
  };

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
}

// Hook for using the admin theme
export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
}
