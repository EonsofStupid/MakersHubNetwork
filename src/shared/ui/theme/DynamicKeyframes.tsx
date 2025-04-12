
import React, { useMemo } from 'react';
import { useSiteTheme } from '@/shared/hooks/useSiteTheme';

/**
 * Generates CSS for keyframe animations from theme
 */
export const DynamicKeyframes: React.FC = () => {
  const { animations } = useSiteTheme();
  
  const keyframesStyles = useMemo(() => {
    if (!animations || Object.keys(animations).length === 0) {
      return '';
    }
    
    // Generate CSS keyframes from the animation definitions
    return Object.entries(animations).map(([name, keyframeObj]) => {
      // Skip if the keyframeObj is not properly structured
      if (!keyframeObj || typeof keyframeObj !== 'object') return '';
      
      // Convert the keyframe object to CSS
      const keyframeContent = Object.entries(keyframeObj)
        .map(([percent, styles]) => {
          // Normalize percentage format
          const normalizedPercent = percent.endsWith('%') 
            ? percent
            : isNaN(Number(percent)) 
              ? percent // Keywords like 'from', 'to'
              : `${percent}%`;
              
          // Skip if styles is missing or not an object
          if (!styles || typeof styles !== 'object') return '';
          
          // Convert style object to CSS string
          const styleString = Object.entries(styles as Record<string, string>)
            .map(([prop, value]) => {
              // Convert camelCase to kebab-case
              const cssProperty = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
              return `${cssProperty}: ${value};`;
            })
            .join(' ');
            
          return `${normalizedPercent} { ${styleString} }`;
        })
        .join(' ');
        
      return `@keyframes ${name} { ${keyframeContent} }`;
    }).join('\n');
  }, [animations]);
  
  if (!keyframesStyles) {
    return null;
  }
  
  return (
    <style>{keyframesStyles}</style>
  );
};
