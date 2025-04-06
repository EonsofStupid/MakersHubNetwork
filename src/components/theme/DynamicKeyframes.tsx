
import React, { useEffect, useRef } from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Component that dynamically injects CSS keyframes from the theme
 * Ensures animations are available in the DOM
 */
export function DynamicKeyframes() {
  const { animations, isLoaded } = useSiteTheme();
  const logger = useLogger('DynamicKeyframes', LogCategory.UI);
  const styleElementRef = useRef<HTMLStyleElement | null>(null);
  
  // Inject keyframes CSS
  useEffect(() => {
    if (!isLoaded || !animations) return;
    
    try {
      // Create a style element if it doesn't exist yet
      if (!styleElementRef.current) {
        const styleElement = document.createElement('style');
        styleElement.id = 'dynamic-keyframes';
        document.head.appendChild(styleElement);
        styleElementRef.current = styleElement;
      }
      
      // Generate keyframes CSS
      let keyframesCss = '';
      
      Object.entries(animations).forEach(([name, keyframeConfig]) => {
        if (name && keyframeConfig) {
          keyframesCss += `@keyframes ${name} {`;
          
          Object.entries(keyframeConfig).forEach(([step, properties]) => {
            keyframesCss += `${step} {`;
            
            if (typeof properties === 'object' && properties !== null) {
              Object.entries(properties).forEach(([prop, value]) => {
                keyframesCss += `${prop}: ${value};`;
              });
            }
            
            keyframesCss += `}`;
          });
          
          keyframesCss += `}`;
        }
      });
      
      // Apply the CSS
      if (styleElementRef.current) {
        styleElementRef.current.textContent = keyframesCss;
      }
      
      logger.debug('Applied dynamic keyframes', {
        details: { 
          keyframesCount: Object.keys(animations).length 
        }
      });
    } catch (error) {
      logger.error('Failed to apply dynamic keyframes', {
        details: { 
          error: error instanceof Error ? error.message : String(error)
        }
      });
    }
    
    // Clean up on unmount
    return () => {
      if (styleElementRef.current && styleElementRef.current.parentNode) {
        styleElementRef.current.parentNode.removeChild(styleElementRef.current);
        styleElementRef.current = null;
      }
    };
  }, [animations, isLoaded, logger]);
  
  // This component doesn't render anything
  return null;
}
