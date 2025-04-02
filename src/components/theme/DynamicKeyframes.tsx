
import React, { useEffect, useState } from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

/**
 * Component that injects keyframe animations based on the current theme
 * This allows animations to use theme colors without needing to be rebuilt with CSS-in-JS
 */
export function DynamicKeyframes() {
  const { variables } = useSiteTheme();
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);
  const logger = getLogger('DynamicKeyframes', LogCategory.THEME);
  
  useEffect(() => {
    // Create a style element for our keyframes if it doesn't exist
    if (!styleElement) {
      logger.debug('Creating dynamic keyframes style element');
      const element = document.createElement('style');
      element.id = 'dynamic-keyframes';
      document.head.appendChild(element);
      setStyleElement(element);
      return () => {
        if (document.head.contains(element)) {
          document.head.removeChild(element);
        }
      };
    }
    
    // Update keyframes with current theme colors
    if (styleElement) {
      logger.debug('Updating keyframes with current theme colors');
      styleElement.textContent = `
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 5px ${variables.primary};
          }
          50% {
            box-shadow: 0 0 20px ${variables.primary};
          }
        }
        
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 2px ${variables.primary};
          }
          50% {
            text-shadow: 0 0 10px ${variables.primary};
          }
        }
        
        @keyframes border-pulse {
          0%, 100% {
            border-color: ${variables.primary};
          }
          50% {
            border-color: ${variables.secondary};
          }
        }
        
        @keyframes background-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
        
        .animate-border-pulse {
          animation: border-pulse 4s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        
        .bg-gradient-animated {
          background: linear-gradient(270deg, ${variables.primary}, ${variables.secondary});
          background-size: 200% 200%;
          animation: background-shift 3s ease infinite;
        }
      `;
    }
  }, [styleElement, variables, logger]);
  
  return null; // This component doesn't render anything visible
}
