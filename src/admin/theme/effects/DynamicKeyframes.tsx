import React, { useEffect, useState } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { useAdminTheme } from '../context/AdminThemeContext';

const logger = getLogger('DynamicKeyframes', { category: LogCategory.THEME });

/**
 * DynamicKeyframes - Creates CSS keyframes animations using
 * the current theme colors. When the theme changes, the
 * animations are automatically updated.
 */
export function DynamicKeyframes() {
  const { theme } = useAdminTheme();
  const [styleId] = useState(`theme-keyframes-${Math.random().toString(36).substr(2, 9)}`);
  
  // Update keyframes when theme changes
  useEffect(() => {
    try {
      // Create or update style element
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      
      // Get theme colors for animations
      const primaryColor = theme.colors.primary;
      const secondaryColor = theme.colors.secondary;
      const accentColor = theme.colors.accent;
      
      // Get timing values
      const normalDuration = theme.animation.duration.normal;
      const fastDuration = theme.animation.duration.fast;
      const slowDuration = theme.animation.duration.slow;
      const easeCurve = theme.animation.curves.ease;
      const bounceCurve = theme.animation.curves.bounce;
      
      // Create keyframes CSS
      styleEl.textContent = `
        /* Fade animations */
        @keyframes theme-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes theme-fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        /* Glow animations */
        @keyframes theme-glow-pulse {
          0%, 100% { box-shadow: 0 0 5px ${primaryColor}40; }
          50% { box-shadow: 0 0 15px ${primaryColor}80; }
        }
        
        @keyframes theme-glow-pulse-secondary {
          0%, 100% { box-shadow: 0 0 5px ${secondaryColor}40; }
          50% { box-shadow: 0 0 15px ${secondaryColor}80; }
        }
        
        /* Scale animations */
        @keyframes theme-scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes theme-scale-out {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
        
        /* Slide animations */
        @keyframes theme-slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes theme-slide-in-left {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        /* Preset animation classes */
        .animate-fade-in {
          animation: theme-fade-in ${normalDuration} ${easeCurve} forwards;
        }
        
        .animate-fade-out {
          animation: theme-fade-out ${normalDuration} ${easeCurve} forwards;
        }
        
        .animate-scale-in {
          animation: theme-scale-in ${fastDuration} ${bounceCurve} forwards;
        }
        
        .animate-scale-out {
          animation: theme-scale-out ${fastDuration} ${easeCurve} forwards;
        }
        
        .animate-glow-pulse {
          animation: theme-glow-pulse 2s infinite;
        }
        
        .animate-glow-pulse-secondary {
          animation: theme-glow-pulse-secondary 2s infinite;
        }
        
        .animate-slide-in-right {
          animation: theme-slide-in-right ${normalDuration} ${easeCurve} forwards;
        }
        
        .animate-slide-in-left {
          animation: theme-slide-in-left ${normalDuration} ${easeCurve} forwards;
        }
      `;
      
      logger.debug('Dynamic keyframes updated with current theme colors');
    } catch (error) {
      logger.error('Failed to create dynamic keyframes', {
        details: safeDetails(error)
      });
    }
    
    return () => {
      // This cleanup is intentionally left empty - we want to keep the styles
      // applied even during re-renders
    };
  }, [theme, styleId]);
  
  // This component doesn't render any UI
  return null;
}
