
import React, { ReactNode, useEffect } from 'react';

interface ThemeInitializerProps {
  children: ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  // Apply any theme initialization logic here
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme-preference') || 'dark';
    
    // Apply theme class to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return <>{children}</>;
}
