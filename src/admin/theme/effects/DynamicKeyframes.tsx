
import React, { useEffect } from 'react';
import { defaultImpulseTokens } from '../impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

/**
 * DynamicKeyframes - Injects theme-based CSS keyframes into the document
 * This allows animations to use theme colors without repeating CSS
 */
export function DynamicKeyframes() {
  const logger = getLogger('DynamicKeyframes', { category: LogCategory.THEME });
  
  useEffect(() => {
    try {
      logger.debug('Injecting dynamic keyframes for theme animations');
      
      // Create a style element for our keyframes
      const styleElement = document.createElement('style');
      styleElement.setAttribute('id', 'impulse-dynamic-keyframes');
      
      // Combine all keyframes
      let keyframesContent = '';
      
      // Add keyframes from the theme
      if (defaultImpulseTokens.animation?.keyframes) {
        keyframesContent += defaultImpulseTokens.animation.keyframes.fade || '';
        keyframesContent += defaultImpulseTokens.animation.keyframes.pulse || '';
        keyframesContent += defaultImpulseTokens.animation.keyframes.glow || '';
        keyframesContent += defaultImpulseTokens.animation.keyframes.slide || '';
      }
      
      // Add additional keyframes that use theme colors
      const pulseGlowKeyframes = `
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 5px ${defaultImpulseTokens.colors.primary}80; 
          }
          50% { 
            box-shadow: 0 0 20px ${defaultImpulseTokens.colors.primary}; 
          }
        }
      `;
      
      const floatKeyframes = `
        @keyframes float {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }
      `;
      
      const shimmerKeyframes = `
        @keyframes shimmer {
          0% {
            background-position: -500px 0;
          }
          100% {
            background-position: 500px 0;
          }
        }
      `;
      
      keyframesContent += pulseGlowKeyframes;
      keyframesContent += floatKeyframes;
      keyframesContent += shimmerKeyframes;
      
      // Set the style content and add to document head
      styleElement.textContent = keyframesContent;
      
      // Remove any existing instance
      const existingStyle = document.getElementById('impulse-dynamic-keyframes');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // Add to document
      document.head.appendChild(styleElement);
      
      logger.debug('Dynamic keyframes injected successfully');
      
      // Clean up on component unmount
      return () => {
        const styleToRemove = document.getElementById('impulse-dynamic-keyframes');
        if (styleToRemove) {
          styleToRemove.remove();
        }
      };
    } catch (error) {
      logger.error('Error injecting dynamic keyframes', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  }, [logger]);
  
  // This component doesn't render anything
  return null;
}
