
import { useEffect, useState } from 'react';
import { useSiteTheme } from './SiteThemeProvider';

export function DynamicKeyframes() {
  const { animations } = useSiteTheme();
  const [styleSheet, setStyleSheet] = useState<HTMLStyleElement | null>(null);
  
  useEffect(() => {
    if (!animations || Object.keys(animations).length === 0) return;
    
    // Check if we already have a style element for our keyframes
    let sheet = document.getElementById('dynamic-keyframes') as HTMLStyleElement | null;
    
    if (!sheet) {
      sheet = document.createElement('style');
      sheet.id = 'dynamic-keyframes';
      document.head.appendChild(sheet);
      setStyleSheet(sheet);
    }
    
    // Create CSS from the keyframes data
    const keyframesCSS = Object.entries(animations)
      .map(([name, frames]) => {
        if (!frames || typeof frames !== 'object') return '';
        
        // Convert the keyframes object to CSS
        const frameCSS = Object.entries(frames as Record<string, any>)
          .map(([percent, styles]) => {
            if (!styles || typeof styles !== 'object') return '';
            
            // Convert the styles object to CSS
            const styleCSS = Object.entries(styles as Record<string, any>)
              .map(([prop, value]) => {
                // Format the property name (camelCase to kebab-case)
                const formattedProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `${formattedProp}: ${value};`;
              })
              .join(' ');
            
            return `${percent} { ${styleCSS} }`;
          })
          .filter(Boolean) // Remove empty entries
          .join('\n');
        
        return `@keyframes ${name} { ${frameCSS} }`;
      })
      .filter(Boolean) // Remove empty entries
      .join('\n\n');
    
    if (sheet && keyframesCSS) {
      sheet.textContent = keyframesCSS;
    }
    
    // Cleanup on unmount
    return () => {
      if (styleSheet && styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, [animations]);
  
  return null;
}
