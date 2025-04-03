
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('DynamicKeyframes', { category: LogCategory.THEME as string });

/**
 * Component that adds dynamic CSS keyframes based on the current theme.
 * This enables animations that use theme colors.
 */
export function DynamicKeyframes() {
  const { currentTheme } = useThemeStore();
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);
  
  useEffect(() => {
    // Create a style element for our dynamic keyframes if it doesn't exist
    if (!styleElement) {
      const element = document.createElement('style');
      element.id = 'theme-dynamic-keyframes';
      document.head.appendChild(element);
      setStyleElement(element);
      
      // Cleanup on component unmount
      return () => {
        if (element && document.head.contains(element)) {
          document.head.removeChild(element);
        }
      };
    }
    
    // If we have both a theme and a style element, update keyframes
    if (currentTheme && styleElement) {
      try {
        const colors = currentTheme.design_tokens?.colors || {};
        const effects = currentTheme.design_tokens?.effects || {};
        
        // Extract colors we need
        const primaryColor = colors.primary || '#00F0FF';
        const secondaryColor = colors.secondary || '#FF2D6E';
        const accentColor = colors.accent || '#8B5CF6';
        
        // Create keyframes CSS
        const keyframesCSS = `
          /* Glow pulse animation with primary color */
          @keyframes glow-pulse {
            0%, 100% { box-shadow: 0 0 5px ${primaryColor}; }
            50% { box-shadow: 0 0 20px ${primaryColor}; }
          }
          
          /* Glow pulse animation with secondary color */
          @keyframes glow-pulse-secondary {
            0%, 100% { box-shadow: 0 0 5px ${secondaryColor}; }
            50% { box-shadow: 0 0 20px ${secondaryColor}; }
          }
          
          /* Fade in animation */
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          /* Slide in animation */
          @keyframes slide-in {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          /* Slide in from right animation */
          @keyframes slide-in-right {
            from { transform: translateX(20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          /* Pulse animation */
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          /* Border glow animation */
          @keyframes border-glow {
            0%, 100% { border-color: rgba(${primaryColor.replace('#', '')}, 0.4); }
            50% { border-color: rgba(${primaryColor.replace('#', '')}, 0.8); }
          }
          
          /* Shimmer animation */
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          /* Utility classes */
          .animate-glow-pulse {
            animation: glow-pulse 2s ease-in-out infinite;
          }
          
          .animate-glow-pulse-secondary {
            animation: glow-pulse-secondary 2s ease-in-out infinite;
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
          
          .animate-slide-in {
            animation: slide-in 0.3s ease-out forwards;
          }
          
          .animate-slide-in-right {
            animation: slide-in-right 0.3s ease-out forwards;
          }
          
          .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .animate-border-glow {
            animation: border-glow 2s ease-in-out infinite;
          }
          
          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
        `;
        
        // Update the style element's content
        styleElement.textContent = keyframesCSS;
        
        logger.debug('Dynamic keyframes updated with theme colors');
      } catch (error) {
        logger.error('Error updating dynamic keyframes', { 
          details: { error: error instanceof Error ? error.message : String(error) } 
        });
      }
    }
  }, [currentTheme, styleElement]);
  
  // This component doesn't render anything
  return null;
}
