
import { useContext } from 'react';
import { SiteThemeContext } from '@/app/theme/SiteThemeProvider';
import { useStore } from 'zustand';
import { useThemeStore } from '@/stores/theme/store';

/**
 * Custom hook to access the site theme context
 * Returns theme variables, component styles, and animations
 */
export function useSiteTheme() {
  const context = useContext(SiteThemeContext);
  
  if (!context) {
    throw new Error('useSiteTheme must be used within a SiteThemeProvider');
  }
  
  const store = useThemeStore();
  
  // Extract needed data from both context and store
  const {
    theme,
    isLoaded,
    componentStyles,
    animations,
    variables
  } = context;
  
  // Provide all theme-related data through a single hook
  return {
    theme,
    isLoaded,
    componentStyles,
    animations,
    variables,
    // Add any additional theme-related functionality here
  };
}
