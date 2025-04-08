
import React, { ReactNode } from 'react';
import { ThemeContext } from '@/types/theme';

interface ThemeInitializerProps {
  children: ReactNode;
  themeContext?: ThemeContext;
  applyImmediately?: boolean;
  fallbackTheme?: {
    primary?: string;
    secondary?: string;
    background?: string;
    foreground?: string;
    [key: string]: string | undefined;
  };
}

export function ThemeInitializer({ 
  children, 
  themeContext = 'site', 
  applyImmediately = true,
  fallbackTheme
}: ThemeInitializerProps) {
  // This is just a placeholder component - we're defining the proper interface
  return <>{children}</>;
}
