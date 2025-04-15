
import React from 'react';
import { useThemeStore } from '@/shared/stores/theme/store';
import { ThemeToken } from '@/shared/types/theme.types';

interface ThemeColorSystemProps {
  children: React.ReactNode;
}

export const ThemeColorSystem: React.FC<ThemeColorSystemProps> = ({ children }) => {
  const theme = useThemeStore(state => state.theme);
  
  if (!theme) {
    return <>{children}</>;
  }
  
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
