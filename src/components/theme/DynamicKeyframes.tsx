
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
          background: linear-gradient(270deg, ${variables.primary}, ${variables.secondary});
          background-size: 200% 200%;
          animation: background-shift 3s ease infinite;
        }
        
        .mainnav-data-stream::before {
          content: '';
          position: absolute;
          inset: 0;
          width: 100%;
          background-image: linear-gradient(90deg, 
            rgba(16, 20, 24, 0) 0%,
            ${variables.primary} 20%,
            ${variables.secondary} 40%,
            ${variables.destructive} 60%,
            ${variables.accent} 80%,
            rgba(16, 20, 24, 0) 100%
          );
          background-size: 200% 100%;
          animation: data-stream 8s linear infinite;
          opacity: 0.3;
        }
        
        .glass-morphism {
          background-color: rgba(${hexToRgb(variables.card)}, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(${hexToRgb(variables.primary)}, 0.3);
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

// Helper function to convert hex to rgb
function hexToRgb(hex: string): string {
  // Default fallback
  if (!hex || typeof hex !== 'string') return '0, 0, 0';
  
  // Handle rgba values
  if (hex.startsWith('rgba')) {
    const matches = hex.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
    if (matches) {
      return `${matches[1]}, ${matches[2]}, ${matches[3]}`;
    }
    return '0, 0, 0';
  }
  
  // Handle rgb values
  if (hex.startsWith('rgb')) {
    const matches = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if (matches) {
      return `${matches[1]}, ${matches[2]}, ${matches[3]}`;
    }
    return '0, 0, 0';
  }
  
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  // Handle invalid values
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '0, 0, 0';
  
  return `${r}, ${g}, ${b}`;
}
