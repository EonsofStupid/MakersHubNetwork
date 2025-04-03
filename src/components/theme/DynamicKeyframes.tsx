
import React from 'react';
import { useSiteTheme } from './SiteThemeProvider';

export function DynamicKeyframes() {
  const { componentStyles } = useSiteTheme();
  
  // Get theme colors to use in animations
  const primaryColor = 'var(--color-primary, 0, 240, 255)';
  const secondaryColor = 'var(--color-secondary, 255, 45, 110)';
  
  // Define dynamic keyframes based on theme colors
  return (
    <style>
      {`
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(${primaryColor}, 0.5);
          }
          50% { 
            box-shadow: 0 0 20px rgba(${primaryColor}, 0.7);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            opacity: 0.8;
          }
          50% { 
            opacity: 0.4;
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0);
          }
          50% { 
            transform: translateY(-10px);
          }
        }
        
        @keyframes scan-line {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        
        @keyframes morph-header {
          0%, 100% {
            border-radius: 0;
            box-shadow: 0 4px 30px rgba(0,0,0,0.1), inset 0 0 30px rgba(${primaryColor},0.1);
          }
          50% {
            border-radius: 0 0 20px 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 0 60px rgba(${primaryColor},0.2);
          }
        }
        
        @keyframes cyber-flicker {
          0%, 100% {
            opacity: 1;
          }
          33% {
            opacity: 0.8;
          }
          66% {
            opacity: 0.4;
            transform: translate(1px, 1px);
          }
        }
        
        @keyframes gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .mainnav-data-stream::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, 
            rgba(${primaryColor}, 0) 0%,
            rgba(${primaryColor}, 0.8) 50%,
            rgba(${primaryColor}, 0) 100%
          );
          animation: data-stream 8s linear infinite;
        }
        
        @keyframes data-stream {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .mainnav-glitch-particles::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(rgba(${primaryColor}, 0.1) 1px, transparent 1px),
            radial-gradient(rgba(${secondaryColor}, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
          animation: particle-drift 120s linear infinite;
        }
        
        @keyframes particle-drift {
          0% {
            background-position: 0 0, 10px 10px;
          }
          100% {
            background-position: 1000px 500px, 1010px 510px;
          }
        }
        
        .mad-scientist-hover:hover::before {
          content: '';
          position: absolute;
          inset: -5px;
          background: linear-gradient(90deg, 
            rgba(${primaryColor}, 0.7), 
            rgba(${secondaryColor}, 0.7), 
            rgba(${primaryColor}, 0.7)
          );
          background-size: 200% 100%;
          animation: gradient-flow 2s linear infinite;
          z-index: -1;
          border-radius: inherit;
          filter: blur(8px);
        }
      `}
    </style>
  );
}
