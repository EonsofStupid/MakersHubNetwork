
import React, { useEffect } from 'react';
import { defaultImpulseTokens } from '@/admin/types/impulse.types';
import { ensureDefaultTheme, getThemeByName } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { getThemeFromLocalStorage, saveThemeToLocalStorage } from '@/stores/theme/localStorage';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeInitializer', { category: LogCategory.THEME as string });

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const { setTheme, isLoading, error } = useThemeStore();

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        logger.info('Initializing theme');
        
        // Check if we have a theme ID in local storage
        const storedThemeId = getThemeFromLocalStorage();
        
        if (storedThemeId) {
          logger.info('Found theme in local storage', { details: { themeId: storedThemeId } });
          // Set the theme from local storage
          await setTheme(storedThemeId);
          return;
        }
        
        // If no theme in local storage, look for the Impulsivity theme by name
        logger.info('No theme in local storage, looking for Impulsivity theme');
        const impulsivityThemeId = await getThemeByName('Impulsivity');
        
        if (impulsivityThemeId) {
          logger.info('Found Impulsivity theme', { details: { themeId: impulsivityThemeId } });
          // Set the theme and save to local storage
          await setTheme(impulsivityThemeId);
          saveThemeToLocalStorage(impulsivityThemeId);
          return;
        }
        
        // If Impulsivity theme not found, ensure a default theme exists
        logger.info('Impulsivity theme not found, ensuring default theme');
        const defaultThemeId = await ensureDefaultTheme();
        
        if (defaultThemeId) {
          logger.info('Using default theme', { details: { themeId: defaultThemeId } });
          // Set the theme and save to local storage
          await setTheme(defaultThemeId);
          saveThemeToLocalStorage(defaultThemeId);
          return;
        }
        
        // If all else fails, use the default tokens directly
        logger.warn('No theme found, using default tokens');
      } catch (err) {
        logger.error('Error initializing theme', { details: safeDetails(err) });
      }
    };
    
    initializeTheme();
  }, [setTheme]);

  if (error) {
    logger.error('Theme initialization error', { details: safeDetails(error) });
  }

  return <>{children}</>;
}
