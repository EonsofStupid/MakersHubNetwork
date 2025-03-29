
import { useEffect } from 'react';
import { useSiteTheme } from './SiteThemeProvider';

export function DynamicKeyframes() {
  const { animations } = useSiteTheme();
  
  useEffect(() => {
    if (!animations || Object.keys(animations).length === 0) return;
    
    // Check if we already have a style element for our keyframes
    let styleSheet = document.getElementById('dynamic-keyframes');
    
    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = 'dynamic-keyframes';
      document.head.appendChild(styleSheet);
    }
    
    // Create CSS from the keyframes data
    const keyframesCSS = Object.entries(animations)
      .map(([name, frames]) => {
        // Convert the keyframes object to CSS
        const frameCSS = Object.entries(frames as Record<string, any>)
          .map(([percent, styles]) => {
            // Convert the styles object to CSS
            const styleCSS = Object.entries(styles as Record<string, any>)
              .map(([prop, value]) => `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
              .join(' ');
            
            return `${percent} { ${styleCSS} }`;
          })
          .join('\n');
        
        return `@keyframes ${name} { ${frameCSS} }`;
      })
      .join('\n\n');
    
    styleSheet.textContent = keyframesCSS;
    
    // Cleanup on unmount
    return () => {
      if (styleSheet && styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, [animations]);
  
  return null;
}
