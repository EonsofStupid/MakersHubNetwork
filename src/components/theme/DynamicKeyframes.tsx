
import React, { useEffect } from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import { getLogger } from '@/logging';

const logger = getLogger('DynamicKeyframes');

/**
 * Dynamically generates and applies @keyframes animations based on the current theme
 */
export function DynamicKeyframes() {
  const { variables } = useSiteTheme();
  
  useEffect(() => {
    try {
      // Get values with fallbacks to ensure animations never fail
      const primary = variables?.primary || '#00F0FF';
      const secondary = variables?.secondary || '#FF2D6E';
      const bg = variables?.background || '#12121A';
      
      // Create a style element for our dynamic keyframes
      let styleElement = document.getElementById('dynamic-theme-keyframes');
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-theme-keyframes';
        document.head.appendChild(styleElement);
        logger.debug('Created dynamic keyframes style element');
      }
      
      // Define keyframes with theme variables
      styleElement.textContent = `
        /* Pulse animation with theme colors */
        @keyframes theme-pulse {
          0%, 100% { box-shadow: 0 0 5px ${primary}; }
          50% { box-shadow: 0 0 20px ${primary}; }
        }
        
        /* Glow animation */
        @keyframes theme-glow {
          0%, 100% { text-shadow: 0 0 5px ${primary}; }
          50% { text-shadow: 0 0 15px ${primary}; }
        }
        
        /* Border pulse */
        @keyframes theme-border-pulse {
          0%, 100% { border-color: ${primary}40; }
          50% { border-color: ${primary}; }
        }
        
        /* Background shimmer */
        @keyframes theme-bg-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Loading animation */
        @keyframes theme-loading {
          0% { transform: rotate(0deg); border-color: ${primary}; }
          50% { border-color: ${secondary}; }
          100% { transform: rotate(360deg); border-color: ${primary}; }
        }
        
        /* Fade in with slight move */
        @keyframes theme-fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        /* Card hover effect animation */
        @keyframes theme-card-hover {
          0%, 100% { box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 8px 25px rgba(0,0,0,0.3), 0 0 15px ${primary}40; }
        }
        
        /* Utility classes that use the animations */
        .animate-theme-pulse {
          animation: theme-pulse 2s infinite ease-in-out;
        }
        
        .animate-theme-glow {
          animation: theme-glow 2s infinite ease-in-out;
        }
        
        .animate-theme-border-pulse {
          animation: theme-border-pulse 2s infinite ease-in-out;
        }
        
        .hover-animate-pulse:hover {
          animation: theme-pulse 2s infinite ease-in-out;
        }
        
        .animate-theme-fade-in {
          animation: theme-fade-in 0.5s ease-out forwards;
        }
        
        .animate-theme-loading {
          animation: theme-loading 1.5s infinite linear;
        }
        
        /* Applying theme colors to various hover effects */
        .hover-border-theme:hover {
          border-color: ${primary};
        }
        
        .hover-text-theme:hover {
          color: ${primary};
        }
        
        .hover-glow-theme:hover {
          box-shadow: 0 0 15px ${primary}40;
        }
      `;
      
      logger.debug('Applied dynamic keyframes with theme colors');
    } catch (error) {
      logger.error('Failed to apply dynamic keyframes', { details: { error } });
      
      // Attempt emergency fallback for critical animations
      try {
        const styleElement = document.getElementById('dynamic-theme-keyframes') || document.createElement('style');
        styleElement.id = 'dynamic-theme-keyframes';
        
        styleElement.textContent = `
          @keyframes theme-pulse {
            0%, 100% { box-shadow: 0 0 5px #00F0FF; }
            50% { box-shadow: 0 0 20px #00F0FF; }
          }
          
          @keyframes theme-glow {
            0%, 100% { text-shadow: 0 0 5px #00F0FF; }
            50% { text-shadow: 0 0 15px #00F0FF; }
          }
          
          .animate-theme-pulse {
            animation: theme-pulse 2s infinite ease-in-out;
          }
          
          .animate-theme-glow {
            animation: theme-glow 2s infinite ease-in-out;
          }
        `;
        
        if (!styleElement.parentNode) {
          document.head.appendChild(styleElement);
        }
        
        logger.debug('Applied emergency fallback animations');
      } catch (fallbackError) {
        logger.error('Critical failure: Unable to apply any animations', { details: { fallbackError } });
      }
    }
    
    return () => {
      // We don't remove the style element on unmount to prevent flicker if remounted
    };
  }, [variables]);
  
  return null; // This component doesn't render anything
}
