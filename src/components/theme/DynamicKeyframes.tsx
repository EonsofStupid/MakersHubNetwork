
import React, { useMemo } from 'react';
import { useSiteTheme } from './SiteThemeProvider';

export function DynamicKeyframes() {
  const { variables } = useSiteTheme();
  
  // Generate dynamic keyframes for animations based on theme colors
  const keyframesStyles = useMemo(() => {
    return `
      @keyframes pulse-primary {
        0% {
          box-shadow: 0 0 0 0 rgba(${variables.primary.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 240, 255'}, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(${variables.primary.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 240, 255'}, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(${variables.primary.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 240, 255'}, 0);
        }
      }
      
      @keyframes pulse-secondary {
        0% {
          box-shadow: 0 0 0 0 rgba(${variables.secondary.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '255, 45, 110'}, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(${variables.secondary.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '255, 45, 110'}, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(${variables.secondary.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '255, 45, 110'}, 0);
        }
      }
      
      @keyframes glow-primary {
        0% {
          filter: drop-shadow(0 0 2px ${variables.primary});
        }
        50% {
          filter: drop-shadow(0 0 5px ${variables.primary});
        }
        100% {
          filter: drop-shadow(0 0 2px ${variables.primary});
        }
      }
      
      @keyframes glow-hover {
        0% {
          box-shadow: 0 0 5px ${variables.primary}, 0 0 10px ${variables.primary};
        }
        50% {
          box-shadow: 0 0 10px ${variables.primary}, 0 0 15px ${variables.primary};
        }
        100% {
          box-shadow: 0 0 5px ${variables.primary}, 0 0 10px ${variables.primary};
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes slideInFromBottom {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes slideInFromLeft {
        from {
          transform: translateX(-20px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideInFromRight {
        from {
          transform: translateX(20px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      /* Add animation classes for easy use */
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out;
      }
      
      .animate-slideInFromBottom {
        animation: slideInFromBottom 0.3s ease-out;
      }
      
      .animate-slideInFromLeft {
        animation: slideInFromLeft 0.3s ease-out;
      }
      
      .animate-slideInFromRight {
        animation: slideInFromRight 0.3s ease-out;
      }
      
      .animate-pulse-primary {
        animation: pulse-primary 2s infinite;
      }
      
      .animate-pulse-secondary {
        animation: pulse-secondary 2s infinite;
      }
      
      .animate-glow-primary {
        animation: glow-primary 3s infinite;
      }
      
      .hover-glow:hover {
        animation: glow-hover 1.5s infinite;
      }
    `;
  }, [variables.primary, variables.secondary]);
  
  return <style dangerouslySetInnerHTML={{ __html: keyframesStyles }} />;
}
