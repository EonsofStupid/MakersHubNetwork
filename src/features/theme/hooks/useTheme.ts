import { useEffect } from 'react';
import { useThemeStore } from '@/app/stores/theme/store';
import { useUIStore } from '@/app/stores/ui/store';
import { Theme, ThemePreference } from '../types';
import { UIState } from '@/app/stores/ui/types';

export const useTheme = () => {
  const {
    currentTheme,
    themeTokens,
    themeComponents,
    adminComponents,
    isLoading,
    error,
    setTheme,
    loadAdminComponents,
  } = useThemeStore();

  const {
    theme: uiTheme,
    preferences,
    setThemeMode,
    setAccentColor,
    setPreference,
  } = useUIStore();

  useEffect(() => {
    // Load admin components if we're in an admin context
    if (window.location.pathname.startsWith('/admin')) {
      loadAdminComponents();
    }
  }, [loadAdminComponents]);

  const updatePreference = (updates: Partial<ThemePreference>) => {
    if (updates.mode) {
      // Convert system mode to dark/light based on user's system preference
      const mode: UIState['theme']['mode'] = updates.mode === 'system' 
        ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : updates.mode;
      setThemeMode(mode);
    }
    if (updates.accentColor) {
      setAccentColor(updates.accentColor);
    }
    if ('reducedMotion' in updates) {
      setPreference('reducedMotion', updates.reducedMotion!);
    }
    if ('highContrast' in updates) {
      setPreference('highContrast', updates.highContrast!);
    }
  };

  const themePreference: ThemePreference = {
    mode: uiTheme.mode,
    accentColor: uiTheme.accentColor,
    reducedMotion: preferences.reducedMotion,
    highContrast: preferences.highContrast,
  };

  return {
    currentTheme,
    themePreference,
    themeTokens,
    themeComponents,
    adminComponents,
    isLoading,
    error,
    setTheme,
    updatePreference,
  };
}; 