
import React, { useEffect, useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

/**
 * Component that injects keyframe animations based on the admin theme
 * This allows animations to use theme colors without needing to be rebuilt with CSS-in-JS
 */
export function DynamicKeyframes() {
  const { currentTheme } = useAdminTheme();
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);
  const logger = getLogger('AdminDynamicKeyframes', LogCategory.THEME);
  
  useEffect(() => {
    // Create a style element for our keyframes if it doesn't exist
    if (!styleElement) {
      logger.debug('Creating dynamic keyframes style element for admin');
      const element = document.createElement('style');
      element.id = 'admin-dynamic-keyframes';
      document.head.appendChild(element);
      setStyleElement(element);
      return () => {
        if (document.head.contains(element)) {
          document.head.removeChild(element);
        }
      };
    }
    
    // Get the theme colors from the current theme or use fallbacks
    const primary = currentTheme?.impulse?.colors?.primary || 'var(--impulse-primary, #00F0FF)';
    const secondary = currentTheme?.impulse?.colors?.secondary || 'var(--impulse-secondary, #FF2D6E)';
    
    // Update keyframes with current theme colors
    if (styleElement) {
      logger.debug('Updating admin keyframes with current theme colors');
      styleElement.textContent = `
        @keyframes admin-glow-pulse {
          0%, 100% {
            box-shadow: 0 0 5px ${primary};
          }
          50% {
            box-shadow: 0 0 20px ${primary};
          }
        }
        
        @keyframes admin-text-glow {
          0%, 100% {
            text-shadow: 0 0 2px ${primary};
          }
          50% {
            text-shadow: 0 0 10px ${primary};
          }
        }
        
        @keyframes admin-border-pulse {
          0%, 100% {
            border-color: ${primary};
          }
          50% {
            border-color: ${secondary};
          }
        }
        
        @keyframes admin-background-shift {
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
        
        @keyframes admin-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes admin-scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes admin-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes admin-pulse {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }
        
        @keyframes scan-line {
          0% { 
            left: -100%; 
            opacity: 0; 
          }
          20% { 
            opacity: 0.5; 
          }
          80% { 
            opacity: 0.2; 
          }
          100% { 
            left: 100%; 
            opacity: 0; 
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 2px ${primary});
          }
          50% {
            filter: drop-shadow(0 0 8px ${primary});
          }
        }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); clip-path: polygon(0 5%, 100% 0, 99% 100%, 1% 96%); }
          40% { transform: translate(2px, -2px); clip-path: polygon(0 0, 100% 2%, 98% 100%, 2% 100%); }
          60% { transform: translate(-1px, -1px); clip-path: polygon(0 0, 100% 0, 97% 95%, 3% 98%); }
          80% { transform: translate(1px, 1px); clip-path: polygon(0 2%, 100% 0, 96% 100%, 4% 97%); }
        }
        
        .admin-animate-glow-pulse {
          animation: admin-glow-pulse 2s ease-in-out infinite;
        }
        
        .admin-animate-text-glow {
          animation: admin-text-glow 2s ease-in-out infinite;
        }
        
        .admin-animate-border-pulse {
          animation: admin-border-pulse 4s ease-in-out infinite;
        }
        
        .admin-animate-float {
          animation: admin-float 3s ease-in-out infinite;
        }
        
        .admin-animate-pulse {
          animation: admin-pulse 3s ease-in-out infinite;
        }
        
        .admin-animate-fade-in {
          animation: admin-fade-in 0.3s ease-out forwards;
        }
        
        .admin-animate-scale-in {
          animation: admin-scale-in 0.3s ease-out forwards;
        }
        
        .admin-bg-gradient-animated {
          background: linear-gradient(270deg, ${primary}, ${secondary});
          background-size: 200% 200%;
          animation: admin-background-shift 3s ease infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `;
    }
  }, [styleElement, currentTheme, logger]);
  
  return null; // This component doesn't render anything visible
}
