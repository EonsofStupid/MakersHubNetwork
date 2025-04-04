
import React from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ThemeInitializer } from './ThemeInitializer';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ThemeInitializer>
        {children}
      </ThemeInitializer>
    </NextThemeProvider>
  );
}
