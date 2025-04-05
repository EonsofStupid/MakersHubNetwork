
import { useEffect, useState, useRef } from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function DynamicKeyframes() {
  const { animations } = useSiteTheme();
  const [styleSheet, setStyleSheet] = useState<HTMLStyleElement | null>(null);
  const logger = useLogger('DynamicKeyframes', LogCategory.UI);
  const prevAnimationsRef = useRef<Record<string, any>>({});
  
  useEffect(() => {
    if (!animations || Object.keys(animations).length === 0) {
      logger.debug('No animations found in theme');
      return;
    }
    
    // Check if animations changed
    const prevAnimations = prevAnimationsRef.current;
    const animationsChanged = JSON.stringify(prevAnimations) !== JSON.stringify(animations);
    
    if (!animationsChanged && styleSheet) {
      return;
    }
    
    // Update reference
    prevAnimationsRef.current = animations;
    
    logger.info('Updating dynamic keyframes', {
      details: {
        keyframesCount: Object.keys(animations).length,
        keyframeNames: Object.keys(animations).join(', ')
      }
    });
    
    // Check if we already have a style element for our keyframes
    let sheet = document.getElementById('dynamic-keyframes') as HTMLStyleElement | null;
    
    if (!sheet) {
      sheet = document.createElement('style');
      sheet.id = 'dynamic-keyframes';
      document.head.appendChild(sheet);
      setStyleSheet(sheet);
    }
    
    // Create CSS from the keyframes data
    let keyframesCSS = '';
    
    try {
      // Convert the keyframes object to CSS
      keyframesCSS = Object.entries(animations)
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
      
      // Add animation classes for the MainNav
      const animationClasses = `
        .animate-morph-header {
          animation: morph-header 3s ease-in-out infinite alternate;
        }
        .animate-data-stream {
          animation: data-stream 2s linear infinite;
        }
        .animate-particles-1 {
          animation: particles-1 6s linear infinite;
        }
        .animate-particles-2 {
          animation: particles-2 8s linear infinite;
        }
        .mainnav-data-stream::before {
          background-image: linear-gradient(90deg, 
            rgba(16, 20, 24, 0) 0%,
            rgba(0, 240, 255, 0.5) 20%,
            rgba(255, 45, 110, 0.5) 40%,
            rgba(239, 68, 68, 0.5) 60%,
            rgba(139, 92, 246, 0.5) 80%,
            rgba(16, 20, 24, 0) 100%
          );
          background-size: 200% 100%;
          animation: mainnav-stream 8s linear infinite;
        }
        .mainnav-glitch-particles::before {
          opacity: 0.5;
          width: 3px;
          height: 3px;
          box-shadow: 
            20px 10px rgba(0, 240, 255, 0.8),
            -40px 30px rgba(239, 68, 68, 0.8),
            80px -20px rgba(255, 45, 110, 0.8),
            -100px -40px rgba(139, 92, 246, 0.8),
            120px 60px rgba(209, 213, 219, 0.8),
            -140px 20px rgba(16, 20, 24, 0.8),
            200px 10px rgba(0, 240, 255, 0.8),
            -240px 30px rgba(239, 68, 68, 0.8),
            280px -20px rgba(255, 45, 110, 0.8),
            -300px -40px rgba(139, 92, 246, 0.8),
            320px 60px rgba(209, 213, 219, 0.8),
            -340px 20px rgba(16, 20, 24, 0.8);
          animation: mainnav-particles-1 6s linear infinite;
        }
        .mainnav-glitch-particles::after {
          opacity: 0.3;
          width: 4px;
          height: 4px;
          box-shadow: 
            -10px -20px rgba(0, 240, 255, 0.6),
            30px 40px rgba(239, 68, 68, 0.6),
            -60px -30px rgba(255, 45, 110, 0.6),
            90px 50px rgba(139, 92, 246, 0.6),
            -110px -70px rgba(209, 213, 219, 0.6),
            130px -30px rgba(16, 20, 24, 0.6),
            210px -20px rgba(0, 240, 255, 0.6),
            -230px 40px rgba(239, 68, 68, 0.6),
            260px -30px rgba(255, 45, 110, 0.6),
            -290px 50px rgba(139, 92, 246, 0.6),
            310px -70px rgba(209, 213, 219, 0.6),
            -330px -30px rgba(16, 20, 24, 0.6);
          animation: mainnav-particles-2 8s linear infinite;
        }
      `;
      
      keyframesCSS += '\n\n' + animationClasses;
      
    } catch (error) {
      logger.error('Error generating keyframes CSS:', { details: error });
    }
    
    if (sheet && keyframesCSS) {
      sheet.textContent = keyframesCSS;
      logger.info('Added dynamic keyframes CSS', {
        details: { cssLength: keyframesCSS.length }
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (styleSheet && styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, [animations, styleSheet, logger]);
  
  return null;
}
