
import React, { useEffect, useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { hexToRgb } from '../utils/themeApplicator';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { getThemeProperty } from '../utils/themeUtils';

/**
 * Component that injects keyframe animations based on the current admin theme
 */
export function DynamicKeyframes() {
  const { currentTheme } = useAdminTheme();
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);
  const logger = getLogger('AdminDynamicKeyframes', { category: LogCategory.THEME });
  
  useEffect(() => {
    // Create or get the style element
    if (!styleElement) {
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
    
    // Get theme colors
    const theme = currentTheme?.impulse;
    
    if (!theme) return;
    
    const primary = getThemeProperty(theme, 'colors.primary', '#00F0FF');
    const secondary = getThemeProperty(theme, 'colors.secondary', '#FF2D6E');
    const accent = getThemeProperty(theme, 'colors.accent', '#8B5CF6');
    
    const primaryRgb = hexToRgb(primary);
    const primaryRgbString = primaryRgb ? `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}` : '0, 240, 255';
    
    const secondaryRgb = hexToRgb(secondary);
    const secondaryRgbString = secondaryRgb ? `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}` : '255, 45, 110';
    
    // Update keyframes with current theme colors
    if (styleElement) {
      logger.debug('Generating keyframes for admin theme');
      
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
        
        @keyframes admin-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
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
        
        @keyframes admin-scale-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes admin-cyber-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(${primaryRgbString}, 0.8), 0 0 20px rgba(${primaryRgbString}, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(${primaryRgbString}, 0.8), 0 0 40px rgba(${primaryRgbString}, 0.5);
          }
        }
        
        @keyframes admin-data-stream {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        
        @keyframes admin-hue-rotate {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(30deg); }
          100% { filter: hue-rotate(0deg); }
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
        
        .admin-animate-scale-pulse {
          animation: admin-scale-pulse 2s ease-in-out infinite;
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
        
        .admin-cyber-glow {
          animation: admin-cyber-glow 3s ease-in-out infinite;
        }
        
        .admin-data-stream::before {
          content: '';
          position: absolute;
          inset: 0;
          width: 100%;
          background-image: linear-gradient(90deg, 
            rgba(16, 20, 24, 0) 0%,
            ${primary} 20%,
            ${secondary} 40%,
            ${accent} 60%,
            ${primary} 80%,
            rgba(16, 20, 24, 0) 100%
          );
          background-size: 200% 100%;
          animation: admin-data-stream 8s linear infinite;
          opacity: 0.3;
        }
        
        .admin-glass-morphism {
          background-color: rgba(${theme.colors?.background?.card ? hexToRgb(theme.colors.background.card)?.r : 28}, ${theme.colors?.background?.card ? hexToRgb(theme.colors.background.card)?.g : 32}, ${theme.colors?.background?.card ? hexToRgb(theme.colors.background.card)?.b : 42}, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(${primaryRgbString}, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .admin-neo-blur {
          backdrop-filter: blur(16px);
          background-color: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .admin-hue-rotate {
          animation: admin-hue-rotate 10s infinite linear;
        }
      `;
    }
  }, [styleElement, currentTheme, logger]);
  
  return null; // This component doesn't render anything visible
}
