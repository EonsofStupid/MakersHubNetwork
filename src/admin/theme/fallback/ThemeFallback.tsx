
import React, { useEffect } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/constants/logLevel';
import { createFallbackStyles } from '../utils/themeApplicator';

export function ThemeFallback() {
  const logger = getLogger('ThemeFallback', { category: LogCategory.THEME });
  
  useEffect(() => {
    logger.debug('Applying theme fallback styles');
    createFallbackStyles();
  }, []);
  
  return null; // This is a utility component with no visible UI
}
