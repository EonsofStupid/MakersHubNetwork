
import React, { useEffect, useState } from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import { themeRegistry } from '@/admin/theme/ThemeRegistry';
import { hexToRgb } from '@/utils/colorUtils';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { usePerformanceLogger } from '@/hooks/use-performance-logger';

// Fallback values for emergency cases
const FALLBACKS = {
  primary: '#00F0FF', // Cyan
  secondary: '#FF2D6E', // Pink
  accent: '#8B5CF6', // Purple
  background: '#12121A', // Dark bg
  foreground: '#F6F6F7' // Light text
};

/**
 * Component that injects keyframe animations based on the current theme
 * This allows animations to use theme colors without needing to be rebuilt with CSS-in-JS
 */
export function DynamicKeyframes() {
  const { variables } = useSiteTheme();
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);
  const logger = getLogger('DynamicKeyframes', { category: LogCategory.THEME });
  const { measure } = usePerformanceLogger('DynamicKeyframes');
  
  useEffect(() => {
    // Create a style element for our keyframes if it doesn't exist
    if (!styleElement) {
      logger.debug('Creating dynamic keyframes style element');
      
      try {
        const element = document.createElement('style');
        element.id = 'dynamic-keyframes';
        document.head.appendChild(element);
        setStyleElement(element);
      } catch (error) {
        logger.error('Failed to create keyframes style element', { details: { error } });
      }
      
      return () => {
        try {
          const element = document.getElementById('dynamic-keyframes') as HTMLStyleElement;
          if (element && document.head.contains(element)) {
            document.head.removeChild(element);
          }
        } catch (cleanupError) {
          logger.error('Error cleaning up keyframes style element', { details: { cleanupError } });
        }
      };
    }
    
    // Get the current active theme
    const themeId = themeRegistry.getActiveThemeId() || 'site-theme';
    
    // Ensure we have valid color values - use hard-coded fallbacks if needed
    const primary = variables?.primary || FALLBACKS.primary;
    const secondary = variables?.secondary || FALLBACKS.secondary; 
    const accent = variables?.accent || FALLBACKS.accent;
    
    // Store basic values as CSS variables (backup method)
    try {
      document.documentElement.style.setProperty('--effect-color', primary);
      document.documentElement.style.setProperty('--site-effect-color', primary);
      document.documentElement.style.setProperty('--site-effect-secondary', secondary);
      document.documentElement.style.setProperty('--site-effect-tertiary', accent);
    } catch (cssError) {
      logger.error('Failed to set basic CSS variables', { details: { cssError } });
    }
    
    // Update keyframes with current theme colors
    if (styleElement) {
      measure('updating-keyframes', () => {
        try {
          // Safely convert colors to RGB format with fallbacks
          const rgbPrimary = hexToRgb(primary) || { r: 0, g: 240, b: 255 }; // Fallback cyan
          const rgbSecondary = hexToRgb(secondary) || { r: 255, g: 45, b: 110 }; // Fallback pink
          
          styleElement.textContent = `
            @keyframes glow-pulse {
              0%, 100% { box-shadow: 0 0 5px ${primary}; }
              50% { box-shadow: 0 0 20px ${primary}; }
            }
            
            @keyframes text-glow {
              0%, 100% { text-shadow: 0 0 2px ${primary}; }
              50% { text-shadow: 0 0 10px ${primary}; }
            }
            
            @keyframes border-pulse {
              0%, 100% { border-color: ${primary}; }
              50% { border-color: ${secondary}; }
            }
            
            @keyframes background-shift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes scale-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 0.4; }
            }
            
            @keyframes morph-header {
              0% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: translateZ(0); }
              100% { clip-path: polygon(0 0, 100% 0, 98% 100%, 2% 100%); transform: translateZ(20px); }
            }
            
            @keyframes data-stream {
              0% { background-position: 0% 0%; }
              100% { background-position: 200% 0%; }
            }
            
            @keyframes cyber-glow {
              0%, 100% {
                box-shadow: 0 0 10px rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.8), 0 0 20px rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.5);
              }
              50% {
                box-shadow: 0 0 20px rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.8), 0 0 40px rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.5);
              }
            }
            
            .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
            .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
            .animate-border-pulse { animation: border-pulse 4s ease-in-out infinite; }
            .animate-float { animation: float 3s ease-in-out infinite; }
            .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            .animate-morph-header { animation: morph-header 3s ease-in-out alternate infinite; transform-style: preserve-3d; perspective: 1000px; }
            
            .bg-gradient-animated {
              background: linear-gradient(270deg, ${primary}, ${secondary});
              background-size: 200% 200%;
              animation: background-shift 3s ease infinite;
            }
            
            .cyber-glow { animation: cyber-glow 3s ease-in-out infinite; }
            
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
              background-color: rgba(28, 32, 42, 0.7);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.3);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .neo-blur {
              backdrop-filter: blur(16px);
              background-color: rgba(0, 0, 0, 0.4);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            /* Navigation-specific animations */
            @keyframes nav-glow {
              0%, 100% { 
                box-shadow: 0 0 15px rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.3);
                border-color: rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.5);
              }
              50% { 
                box-shadow: 0 0 30px rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.6);
                border-color: rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.8);
              }
            }
            
            .nav-animated {
              animation: nav-glow 4s ease-in-out infinite;
            }
            
            /* Footer animations */
            @keyframes footer-float {
              0%, 100% {
                transform: perspective(1000px) rotateX(1deg) translateY(0);
              }
              50% {
                transform: perspective(1000px) rotateX(2deg) translateY(-10px);
              }
            }
            
            @keyframes footer-pulse {
              0%, 100% {
                opacity: 0.8;
                box-shadow: 0 -8px 32px 0 rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.2);
              }
              50% {
                opacity: 1;
                box-shadow: 0 -12px 48px 0 rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.3);
              }
            }
            
            .footer-animate {
              animation: footer-pulse 4s ease-in-out infinite;
            }
            
            .footer-float {
              animation: footer-float 3s ease-in-out infinite;
            }
          `;
        } catch (error) {
          logger.error('Error updating dynamic keyframes', { details: { error } });
          
          // Ultra-minimal fallback in case of errors - only the most critical animations
          try {
            styleElement.textContent = `
              @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
              
              .glass-morphism {
                background-color: rgba(28, 32, 42, 0.7);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(0, 240, 255, 0.3);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }
              
              /* Basic animation fallbacks */
              .animate-glow-pulse { animation: pulse 2s ease-in-out infinite; }
              .animate-text-glow { text-shadow: 0 0 5px #00F0FF; }
              .animate-border-pulse { border-color: #00F0FF; }
              .animate-float { animation: float 3s ease-in-out infinite; }
              
              @keyframes pulse {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 0.4; }
              }
              
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              
              /* Navigation fallback */
              .nav-animated {
                box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
                border-color: rgba(0, 240, 255, 0.5);
              }
              
              /* Footer fallback */
              .footer-animate {
                animation: pulse 4s ease-in-out infinite;
              }
            `;
          } catch (fallbackError) {
            logger.error('Even fallback keyframes failed', { details: { fallbackError } });
          }
        }
      });
    }
  }, [styleElement, variables, logger, measure]);
  
  return null; // This component doesn't render anything visible
}
