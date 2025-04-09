
import React from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import { createGlobalStyle } from 'styled-components';

// Create global styled component for keyframes
const GlobalKeyframes = createGlobalStyle<{ css: string }>`
  ${props => props.css}
`;

export function DynamicKeyframes() {
  const { animations } = useSiteTheme();
  
  // If no animations defined, return null
  if (!animations || Object.keys(animations).length === 0) {
    return null;
  }
  
  // Convert animation definitions to CSS
  let css = '';
  
  try {
    // Build keyframes CSS
    Object.entries(animations).forEach(([name, keyframes]) => {
      if (!keyframes) return;
      
      css += `@keyframes ${name} {\n`;
      
      Object.entries(keyframes).forEach(([position, styles]) => {
        css += `  ${position} {\n`;
        
        Object.entries(styles).forEach(([property, value]) => {
          if (typeof value === 'string' || typeof value === 'number') {
            css += `    ${property}: ${value};\n`;
          }
        });
        
        css += '  }\n';
      });
      
      css += '}\n';
    });
  } catch (error) {
    console.error('Error generating dynamic keyframes:', error);
    return null;
  }
  
  return css ? <GlobalKeyframes css={css} /> : null;
}
