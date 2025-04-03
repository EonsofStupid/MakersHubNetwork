
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { themeRegistry } from '../ThemeRegistry';

export function DynamicKeyframes() {
  const { currentTheme } = useThemeStore();
  const logger = getLogger('DynamicKeyframes', { category: LogCategory.THEME });

  useEffect(() => {
    try {
      const theme = currentTheme ? themeRegistry.getTheme(currentTheme.id) : themeRegistry.getDefaultTheme();
      
      if (!theme) return;
      
      // Get colors for animations
      const primaryColor = theme?.colors?.primary || '#00F0FF';
      const secondaryColor = theme?.colors?.secondary || '#FF2D6E';
      
      // Generate keyframes for the admin theme
      const styleTag = document.createElement('style');
      styleTag.id = 'dynamic-admin-keyframes';
      
      styleTag.textContent = `
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px ${primaryColor}50; }
          50% { box-shadow: 0 0 15px ${primaryColor}80; }
        }
        
        @keyframes text-shimmer {
          0% { color: ${primaryColor}; text-shadow: 0 0 4px ${primaryColor}80; }
          50% { color: ${secondaryColor}; text-shadow: 0 0 4px ${secondaryColor}80; }
          100% { color: ${primaryColor}; text-shadow: 0 0 4px ${primaryColor}80; }
        }
        
        @keyframes border-pulse {
          0%, 100% { border-color: ${primaryColor}40; }
          50% { border-color: ${primaryColor}80; }
        }
        
        @keyframes morph-header {
          0%, 100% { border-bottom-color: ${primaryColor}30; }
          50% { border-bottom-color: ${secondaryColor}30; }
        }
        
        @keyframes morph-slow {
          0% { border-radius: 50%; }
          25% { border-radius: 55% 45% 55% 45%; }
          50% { border-radius: 45% 55% 45% 55%; }
          75% { border-radius: 55% 45% 55% 45%; }
          100% { border-radius: 50%; }
        }
        
        .animate-pulse-glow { animation: pulse-glow 2.5s infinite ease-in-out; }
        .animate-text-shimmer { animation: text-shimmer 3s infinite ease-in-out; }
        .animate-border-pulse { animation: border-pulse 2s infinite ease-in-out; }
        .animate-morph-header { animation: morph-header 5s infinite ease-in-out; }
        .animate-morph-slow { animation: morph-slow 4s infinite ease-in-out; }
      `;
      
      // Remove any existing keyframes
      const existingStyle = document.getElementById('dynamic-admin-keyframes');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // Add the new keyframes
      document.head.appendChild(styleTag);
      
      logger.debug('Dynamic keyframes added to document');
      
      return () => {
        styleTag.remove();
        logger.debug('Dynamic keyframes removed from document');
      };
    } catch (error) {
      logger.error('Error setting up dynamic keyframes', { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }, [currentTheme, logger]);

  return null;
}
