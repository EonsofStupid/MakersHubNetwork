
import React, { useEffect } from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('DynamicKeyframes', { category: LogCategory.THEME });

// Fallback values for critical colors if theme fails to load
const FALLBACKS = {
  primary: '#00F0FF',
  secondary: '#FF2D6E',
  accent: '#8B5CF6',
  background: '#12121A',
  foreground: '#F6F6F7',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
};

/**
 * Dynamically generates and applies @keyframes animations based on the current theme
 */
export function DynamicKeyframes() {
  const { variables } = useSiteTheme();
  
  useEffect(() => {
    try {
      // Get values with fallbacks to ensure animations never fail
      const primary = variables?.primary || FALLBACKS.primary;
      const secondary = variables?.secondary || FALLBACKS.secondary;
      const accent = variables?.accent || FALLBACKS.accent;
      const bg = variables?.background || FALLBACKS.background;
      const success = variables?.success || FALLBACKS.success;
      const warning = variables?.warning || FALLBACKS.warning;
      const error = variables?.error || FALLBACKS.error;
      
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
        
        /* Scale in animation */
        @keyframes theme-scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        /* Float animation */
        @keyframes theme-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        /* Rainbow border animation */
        @keyframes theme-rainbow-border {
          0% { border-color: ${primary}; }
          33% { border-color: ${secondary}; }
          66% { border-color: ${accent}; }
          100% { border-color: ${primary}; }
        }
        
        /* Card hover effect animation */
        @keyframes theme-card-hover {
          0%, 100% { box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 8px 25px rgba(0,0,0,0.3), 0 0 15px ${primary}40; }
        }
        
        /* Gradient flow animation */
        @keyframes theme-gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Status animations */
        @keyframes theme-success-pulse {
          0%, 100% { box-shadow: 0 0 5px ${success}; }
          50% { box-shadow: 0 0 15px ${success}; }
        }
        
        @keyframes theme-warning-pulse {
          0%, 100% { box-shadow: 0 0 5px ${warning}; }
          50% { box-shadow: 0 0 15px ${warning}; }
        }
        
        @keyframes theme-error-pulse {
          0%, 100% { box-shadow: 0 0 5px ${error}; }
          50% { box-shadow: 0 0 15px ${error}; }
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
        
        .animate-theme-float {
          animation: theme-float 3s infinite ease-in-out;
        }
        
        .animate-theme-fade-in {
          animation: theme-fade-in 0.5s ease-out forwards;
        }
        
        .animate-theme-scale-in {
          animation: theme-scale-in 0.3s ease-out forwards;
        }
        
        .animate-theme-loading {
          animation: theme-loading 1.5s infinite linear;
        }
        
        .animate-theme-rainbow-border {
          animation: theme-rainbow-border 6s infinite linear;
        }
        
        .animate-theme-success {
          animation: theme-success-pulse 2s infinite ease-in-out;
        }
        
        .animate-theme-warning {
          animation: theme-warning-pulse 2s infinite ease-in-out;
        }
        
        .animate-theme-error {
          animation: theme-error-pulse 2s infinite ease-in-out;
        }
        
        /* Hover variants */
        .hover-animate-pulse:hover {
          animation: theme-pulse 2s infinite ease-in-out;
        }
        
        .hover-animate-float:hover {
          animation: theme-float 3s infinite ease-in-out;
        }
        
        .hover-animate-glow:hover {
          animation: theme-glow 2s infinite ease-in-out;
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
        
        /* Gradient backgrounds */
        .bg-theme-gradient {
          background: linear-gradient(135deg, ${primary}, ${secondary});
        }
        
        .bg-theme-gradient-animated {
          background: linear-gradient(135deg, ${primary}, ${secondary}, ${primary});
          background-size: 200% 200%;
          animation: theme-gradient-flow 3s ease infinite;
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
            0%, 100% { box-shadow: 0 0 5px ${FALLBACKS.primary}; }
            50% { box-shadow: 0 0 20px ${FALLBACKS.primary}; }
          }
          
          @keyframes theme-glow {
            0%, 100% { text-shadow: 0 0 5px ${FALLBACKS.primary}; }
            50% { text-shadow: 0 0 15px ${FALLBACKS.primary}; }
          }
          
          @keyframes theme-fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-theme-pulse {
            animation: theme-pulse 2s infinite ease-in-out;
          }
          
          .animate-theme-glow {
            animation: theme-glow 2s infinite ease-in-out;
          }
          
          .animate-theme-fade-in {
            animation: theme-fade-in 0.5s ease-out forwards;
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
