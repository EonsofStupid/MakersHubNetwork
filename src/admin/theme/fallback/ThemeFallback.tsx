
import React, { useEffect } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { createFallbackStyles } from '../utils/themeApplicator';

const logger = getLogger('ThemeFallback', { category: LogCategory.THEME });

/**
 * Provides an immediate fallback styling mechanism that applies
 * before JavaScript is fully loaded
 */
export function ThemeFallback() {
  useEffect(() => {
    try {
      // Create fallback styles
      createFallbackStyles();
      logger.debug('Fallback styles initialized');
      
      // Add critical class to root
      document.documentElement.classList.add('theme-fallback-applied');
    } catch (error) {
      logger.error('Failed to initialize fallback styles', {
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
    
    return () => {
      // Don't remove fallback class on component unmount - it's handled by theme initialization
    };
  }, []);
  
  // This is a utility component that doesn't render UI
  return null;
}
