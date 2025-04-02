
import React, { useEffect } from 'react';
import { defaultImpulseTokens } from '../impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

const logger = getLogger('ThemeFallback', LogCategory.THEME);

/**
 * Applies immediate fallback styles to prevent white flash during loading
 * This component has no visual rendering - it only applies styles to the document
 */
export function ThemeFallback() {
  useEffect(() => {
    // Apply fallback immediately to prevent white flash
    logger.debug('Applying immediate fallback styles');
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
    
    // Create and add fallback CSS styles
    const styleElement = document.createElement('style');
    styleElement.id = 'theme-fallback-styles';
    styleElement.textContent = `
      :root {
        --background: ${defaultImpulseTokens.colors.background.main};
        --foreground: ${defaultImpulseTokens.colors.text.primary};
        --card: ${defaultImpulseTokens.colors.background.card};
        --card-foreground: ${defaultImpulseTokens.colors.text.primary};
        --primary: ${defaultImpulseTokens.colors.primary};
        --primary-foreground: ${defaultImpulseTokens.colors.text.primary};
        --secondary: ${defaultImpulseTokens.colors.secondary};
        --secondary-foreground: ${defaultImpulseTokens.colors.text.primary};
        --muted: ${defaultImpulseTokens.colors.text.secondary};
        --muted-foreground: rgba(255, 255, 255, 0.5);
        --accent: #131D35;
        --accent-foreground: ${defaultImpulseTokens.colors.text.primary};
        --destructive: #EF4444;
        --destructive-foreground: ${defaultImpulseTokens.colors.text.primary};
        --border: ${defaultImpulseTokens.colors.borders.normal};
        --input: #131D35;
        --ring: #1E293B;
        
        /* Animation timings */
        --transition-fast: ${defaultImpulseTokens.animation.duration.fast};
        --transition-normal: ${defaultImpulseTokens.animation.duration.normal};
        --transition-slow: ${defaultImpulseTokens.animation.duration.slow};
        
        /* Default effect styles */
        --glow-primary: ${defaultImpulseTokens.effects.glow.primary};
        --glow-secondary: ${defaultImpulseTokens.effects.glow.secondary};
        --glow-hover: ${defaultImpulseTokens.effects.glow.hover};
      }
      
      body {
        background-color: ${defaultImpulseTokens.colors.background.main};
        color: ${defaultImpulseTokens.colors.text.primary};
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      /* Basic keyframe animations for immediate use */
      @keyframes fallback-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fallback-pulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 0.4; }
      }
      
      .theme-fallback-applied .animate-fade {
        animation: fallback-fade-in 0.3s ease-out forwards;
      }
      
      .theme-fallback-applied .animate-pulse {
        animation: fallback-pulse 2s ease-in-out infinite;
      }
    `;
    
    document.head.appendChild(styleElement);
    
    return () => {
      // Clean up inline styles when component unmounts
      root.classList.remove('theme-fallback-applied');
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
}
