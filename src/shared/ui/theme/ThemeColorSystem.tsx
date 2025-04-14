// Update token handling
// Instead of token.value directly, use:
import React from 'react';
import { useThemeStore } from '@/shared/stores/theme/store';
import { ThemeToken } from '@/shared/types/theme.types';

// Helper function to get token value safely
export const getTokenValue = (token: ThemeToken): string => {
  return token.token_value || token.value || '';
};

interface ThemeColorSystemProps {
  children: React.ReactNode;
}

/**
 * ThemeColorSystem component
 * Provides theme variables to the application
 */
export const ThemeColorSystem: React.FC<ThemeColorSystemProps> = ({ children }) => {
  const theme = useThemeStore(state => state.theme);
  
  // If no theme is loaded, return children without applying styles
  if (!theme) {
    return <>{children}</>;
  }
  
  // Generate CSS variables from theme variables
  const cssVars = Object.entries(theme.designTokens.colors || {}).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [`--color-${key}`]: value,
    };
  }, {});
  
  return (
    <div style={cssVars as React.CSSProperties}>
      {children}
    </div>
  );
};
