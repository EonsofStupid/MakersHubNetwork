
import { useState, useEffect } from 'react';

type AppSettings = {
  enableAnimations: boolean;
  darkMode: boolean;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'x-large';
};

const defaultSettings: AppSettings = {
  enableAnimations: true,
  darkMode: true,
  reducedMotion: false,
  fontSize: 'normal',
};

/**
 * Hook for managing application settings
 * These settings are specific to the app module and not shared with other modules
 */
export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load settings from localStorage on initial render
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
};
