
import React, { useEffect, useState } from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import { themeRegistry } from '@/admin/theme/ThemeRegistry';
import { hexToRgb } from '@/admin/theme/utils/themeApplicator';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

/**
 * Component that injects keyframe animations based on the current theme
 * This allows animations to use theme colors without needing to be rebuilt with CSS-in-JS
 */
export function DynamicKeyframes() {
  const { variables } = useSiteTheme();
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);
  const logger = getLogger('DynamicKeyframes', { category: LogCategory.THEME });
  
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
    
    // Get the current active theme
    const themeId = themeRegistry.getActiveThemeId() || 'site-theme';
    const activeTheme = themeId === 'site-theme' ? themeRegistry.getTheme(themeId) : themeRegistry.getDefaultTheme();
    
    const primary = variables.primary;
    const secondary = variables.secondary;
    const accent = variables.accent;
    const rgbPrimary = hexToRgb(primary);
    const rgbSecondary = hexToRgb(secondary);
    
    // Update keyframes with current theme colors
    if (styleElement) {
      logger.debug('Updating keyframes with current theme colors');
      styleElement.textContent = `
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 5px ${primary};
          }
          50% {
            box-shadow: 0 0 20px ${primary};
          }
        }
        
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 2px ${primary};
          }
          50% {
            text-shadow: 0 0 10px ${primary};
          }
        }
        
        @keyframes border-pulse {
          0%, 100% {
            border-color: ${primary};
          }
          50% {
            border-color: ${secondary};
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
        
        @keyframes morph-header {
          0% { 
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); 
            transform: translateZ(0); 
          }
          100% { 
            clip-path: polygon(0 0, 100% 0, 98% 100%, 2% 100%); 
            transform: translateZ(20px); 
          }
        }
        
        @keyframes data-stream {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        
        @keyframes cyber-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(${rgbPrimary ? `${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}` : '0, 240, 255'}, 0.8), 0 0 20px rgba(${rgbPrimary ? `${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}` : '0, 240, 255'}, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(${rgbPrimary ? `${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}` : '0, 240, 255'}, 0.8), 0 0 40px rgba(${rgbPrimary ? `${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}` : '0, 240, 255'}, 0.5);
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
        
        .animate-morph-header {
          animation: morph-header 3s ease-in-out alternate infinite;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .bg-gradient-animated {
          background: linear-gradient(270deg, ${primary}, ${secondary});
          background-size: 200% 200%;
          animation: background-shift 3s ease infinite;
        }
        
        .cyber-glow {
          animation: cyber-glow 3s ease-in-out infinite;
        }
        
        .mainnav-data-stream::before {
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
          animation: data-stream 8s linear infinite;
          opacity: 0.3;
        }
        
        .glass-morphism {
          background-color: rgba(${variables.card ? hexToRgb(variables.card)?.r || 28 : 28}, ${variables.card ? hexToRgb(variables.card)?.g || 32 : 32}, ${variables.card ? hexToRgb(variables.card)?.b || 42 : 42}, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(${rgbPrimary ? `${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}` : '0, 240, 255'}, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .neo-blur {
          backdrop-filter: blur(16px);
          background-color: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `;
    }
  }, [styleElement, variables, logger]);
  
  return null; // This component doesn't render anything visible
}
