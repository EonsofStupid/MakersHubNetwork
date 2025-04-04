
import React, { useEffect } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/constants/logLevel';
import { createFallbackStyles } from '../utils/themeApplicator';

export function ThemeFallback() {
  const logger = getLogger('ThemeFallback', { category: LogCategory.THEME });
  
  useEffect(() => {
    logger.debug('Applying theme fallback styles');
    try {
      createFallbackStyles();
    } catch (error) {
      logger.error('Failed to apply fallback styles', { details: { error } });
      // Apply minimal emergency styles directly
      document.documentElement.style.backgroundColor = '#12121A';
      document.documentElement.style.color = '#F6F6F7';
      document.body.style.backgroundColor = '#12121A';
      document.body.style.color = '#F6F6F7';
    }
  }, []);
  
  return null; // This is a utility component with no visible UI
}
