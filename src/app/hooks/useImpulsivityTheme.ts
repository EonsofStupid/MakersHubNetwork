import { useState, useCallback } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { useThemeStore } from '@/shared/store/theme/store';
import { LogCategory } from '@/shared/types/shared.types';

interface UseImpulsivityThemeResult {
  applyTheme: () => Promise<boolean>;
  isSyncing: boolean;
}

export function useImpulsivityTheme(): UseImpulsivityThemeResult {
  const [isSyncing, setIsSyncing] = useState(false);
  const logger = useLogger('useImpulsivityTheme', LogCategory.UI);
  const { setActiveTheme } = useThemeStore();
  
  const applyTheme = useCallback(async () => {
    if (isSyncing) {
      logger.debug('Theme sync already in progress');
      return false;
    }
    
    try {
      setIsSyncing(true);
      
      logger.debug('Applying Impulsivity theme');
      
      // Apply the theme via the theme store using setActiveTheme
      await setActiveTheme('impulsivity');
      
      logger.debug('Impulsivity theme applied successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to apply Impulsivity theme: ${message}`);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, logger, setActiveTheme]);
  
  return { applyTheme, isSyncing };
}
