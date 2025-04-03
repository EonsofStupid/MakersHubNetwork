
import { FC, useEffect, useRef } from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('DynamicKeyframes', { category: LogCategory.THEME });

/**
 * Component that adds dynamic CSS keyframes animations based on theme colors
 */
export const DynamicKeyframes: FC = () => {
  const { variables } = useSiteTheme();
  const styleRef = useRef<HTMLStyleElement | null>(null);
  
  // Add dynamic keyframes when theme changes
  useEffect(() => {
    try {
      // Create or get style element
      if (!styleRef.current) {
        styleRef.current = document.createElement('style');
        styleRef.current.id = 'dynamic-theme-keyframes';
        document.head.appendChild(styleRef.current);
        logger.debug('Created dynamic keyframes style element');
      }
      
      // Define all animations based on theme colors
      const primary = variables.primary;
      const secondary = variables.secondary;
      const accent = variables.accent;
      
      // Define keyframes CSS
      styleRef.current.textContent = `
        /* Glow Pulse Animation */
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 5px ${primary}; }
          50% { box-shadow: 0 0 20px ${primary}; }
        }
        
        /* Color Cycle Animation */
        @keyframes color-cycle {
          0%, 100% { background-color: ${primary}; }
          33% { background-color: ${secondary}; }
          66% { background-color: ${accent}; }
        }
        
        /* Border Glow Animation */
        @keyframes border-glow {
          0%, 100% { border-color: ${primary}; }
          50% { border-color: ${secondary}; }
        }
        
        /* Text Glow Animation */
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 5px ${primary}; }
          50% { text-shadow: 0 0 20px ${primary}; }
        }
        
        /* Gradient Flow Animation */
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Data Stream animation */
        @keyframes data-stream {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        /* Particle animation */
        @keyframes particles-1 {
          0% { transform: translate(-50%, 0); }
          20% { transform: translate(calc(-50% - 100px), 50px); }
          40% { transform: translate(calc(-50% + 100px), -100px); }
          60% { transform: translate(calc(-50% - 50px), 100px); }
          80% { transform: translate(calc(-50% + 100px), -50px); }
          100% { transform: translate(-50%, 0); }
        }
        
        @keyframes particles-2 {
          0% { transform: translate(-50%, 0); }
          25% { transform: translate(calc(-50% + 100px), -50px); }
          50% { transform: translate(calc(-50% - 100px), 100px); }
          75% { transform: translate(calc(-50% + 50px), -100px); }
          100% { transform: translate(-50%, 0); }
        }
        
        /* Apply utility classes for animations */
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .animate-color-cycle {
          animation: color-cycle 6s ease-in-out infinite;
        }
        
        .animate-border-glow {
          animation: border-glow 2s ease-in-out infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
        
        .animate-gradient-flow {
          background: linear-gradient(270deg, ${primary}, ${secondary}, ${accent});
          background-size: 200% 200%;
          animation: gradient-flow 6s ease infinite;
        }
        
        .animate-data-stream {
          position: relative;
        }
        
        .animate-data-stream::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, 
            rgba(0, 0, 0, 0) 0%,
            ${primary}20 20%,
            ${primary}30 40%,
            ${primary}20 60%,
            rgba(0, 0, 0, 0) 100%
          );
          background-size: 200% 100%;
          animation: data-stream 8s linear infinite;
          pointer-events: none;
        }
      `;
      
      logger.debug('Updated dynamic keyframes with theme colors');
    } catch (error) {
      logger.error('Error setting up dynamic keyframes', { details: safeDetails(error) });
    }
    
    // Cleanup on unmount
    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
        styleRef.current = null;
        logger.debug('Removed dynamic keyframes style element');
      }
    };
  }, [variables]);
  
  // This component doesn't render anything
  return null;
};
