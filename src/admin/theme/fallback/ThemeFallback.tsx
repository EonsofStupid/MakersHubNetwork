
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
    
    // Apply critical fallback styles immediately
    root.style.setProperty('--background', defaultImpulseTokens.colors.background.main);
    root.style.setProperty('--foreground', defaultImpulseTokens.colors.text.primary);
    root.style.setProperty('--impulse-bg-main', defaultImpulseTokens.colors.background.main);
    root.style.setProperty('--impulse-text-primary', defaultImpulseTokens.colors.text.primary);
    root.style.setProperty('--impulse-primary', defaultImpulseTokens.colors.primary);
    root.style.setProperty('--impulse-secondary', defaultImpulseTokens.colors.secondary);
    
    // Force immediate background color to prevent white flash
    document.body.style.backgroundColor = defaultImpulseTokens.colors.background.main;
    document.body.style.color = defaultImpulseTokens.colors.text.primary;
    
    // Add fallback class
    root.classList.add('theme-fallback-applied');
    
    // Ensure that the CSS file is loaded
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = '/src/admin/theme/fallback/theme-fallback.css';
    document.head.appendChild(linkElement);
    
    return () => {
      // Clean up inline styles when component unmounts
      root.classList.remove('theme-fallback-applied');
      document.head.removeChild(linkElement);
    };
  }, []);
  
  return null; // This component doesn't render anything
}
