
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
    
    // Apply glass effect variables
    root.style.setProperty('--glass-opacity', '0.7');
    root.style.setProperty('--glass-blur', '12px');
    root.style.setProperty('--glass-border-color', `rgba(${hexToRgb(defaultImpulseTokens.colors.primary)}, 0.3)`);
    root.style.setProperty('--glass-background', `rgba(${hexToRgb(defaultImpulseTokens.colors.background.card)}, var(--glass-opacity))`);
    
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
        
        /* Glass effect variables */
        --glass-opacity: 0.7;
        --glass-blur: 12px;
        --glass-border-color: rgba(${hexToRgb(defaultImpulseTokens.colors.primary)}, 0.3);
        --glass-background: rgba(${hexToRgb(defaultImpulseTokens.colors.background.card)}, var(--glass-opacity));
        
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
      
      /* Glass morphism styles */
      .glass-morphism {
        background-color: var(--glass-background);
        backdrop-filter: blur(var(--glass-blur));
        border: 1px solid var(--glass-border-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .neo-blur {
        backdrop-filter: blur(calc(var(--glass-blur) * 1.5));
        background-color: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
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
      
      @keyframes fallback-glow {
        0%, 100% { 
          box-shadow: 0 0 5px rgba(${hexToRgb(defaultImpulseTokens.colors.primary)}, 0.5);
        }
        50% { 
          box-shadow: 0 0 20px rgba(${hexToRgb(defaultImpulseTokens.colors.primary)}, 0.7);
        }
      }
      
      .theme-fallback-applied .animate-fade {
        animation: fallback-fade-in 0.3s ease-out forwards;
      }
      
      .theme-fallback-applied .animate-pulse {
        animation: fallback-pulse 2s ease-in-out infinite;
      }
      
      .theme-fallback-applied .animate-glow {
        animation: fallback-glow 2s ease-in-out infinite;
      }
      
      /* Admin top navigation styles */
      .admin-topnav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        height: 3.5rem;
        width: 100%;
        background-color: rgba(${hexToRgb(defaultImpulseTokens.colors.background.overlay)}, 0.85);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(${hexToRgb(defaultImpulseTokens.colors.primary)}, 0.2);
        clip-path: polygon(0 0, 100% 0, 97% 100%, 3% 100%);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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

// Helper function to convert hex to rgb
function hexToRgb(hex: string): string {
  // Default fallback
  if (!hex || typeof hex !== 'string') return '0, 0, 0';
  
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
