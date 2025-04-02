
import React, { useEffect } from 'react';
import { defaultImpulseTokens } from '../impulse/tokens';

/**
 * Applies immediate fallback styles to prevent white flash during loading
 * This component has no visual rendering - it only applies styles to the document
 */
export function ThemeFallback() {
  useEffect(() => {
    // Apply fallback immediately to prevent white flash
    const root = document.documentElement;
    
    // Background and text colors (most important for UX)
    root.style.setProperty('--background', defaultImpulseTokens.colors.background.main);
    root.style.setProperty('--foreground', defaultImpulseTokens.colors.text.primary);
    root.style.setProperty('--impulse-bg-main', defaultImpulseTokens.colors.background.main);
    root.style.setProperty('--impulse-text-primary', defaultImpulseTokens.colors.text.primary);
    
    // Add fallback class
    root.classList.add('theme-fallback-applied');
    
    return () => {
      // Remove inline styles when component unmounts
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--impulse-bg-main');
      root.style.removeProperty('--impulse-text-primary');
      root.classList.remove('theme-fallback-applied');
    };
  }, []);
  
  return null; // This component doesn't render anything
}
