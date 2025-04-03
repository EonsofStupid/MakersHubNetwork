
import React, { useEffect, useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { getThemeProperty } from '../utils/themeUtils';
import { hexToRgb, hexToRgbString } from '@/utils/colorUtils';
import { usePerformanceLogger } from '@/hooks/use-performance-logger';

// Fallback values for emergency cases
const FALLBACKS = {
  primary: '#00F0FF', // Cyan
  secondary: '#FF2D6E', // Pink
  accent: '#8B5CF6', // Purple
  background: '#12121A', // Dark bg
  foreground: '#F6F6F7', // Light text
  success: '#10B981', // Green
  warning: '#F59E0B', // Orange
  error: '#EF4444'    // Red
};

/**
 * Component that injects keyframe animations based on the current admin theme
 */
export function DynamicKeyframes() {
  const { currentTheme } = useAdminTheme();
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);
  const logger = getLogger('AdminDynamicKeyframes', { category: LogCategory.THEME });
  const { measure } = usePerformanceLogger('AdminDynamicKeyframes');
  
  useEffect(() => {
    // Create or get the style element
    if (!styleElement) {
      try {
        // Check if an existing element exists before creating a new one
        let element = document.getElementById('admin-dynamic-keyframes') as HTMLStyleElement;
        
        if (!element) {
          element = document.createElement('style');
          element.id = 'admin-dynamic-keyframes';
          document.head.appendChild(element);
          logger.debug('Created new admin keyframes style element');
        } else {
          logger.debug('Using existing admin keyframes style element');
        }
        
        setStyleElement(element);
      } catch (error) {
        logger.error('Failed to create admin keyframes style element', { details: { error } });
      }
      
      return () => {
        try {
          const element = document.getElementById('admin-dynamic-keyframes') as HTMLStyleElement;
          if (element && document.head.contains(element)) {
            document.head.removeChild(element);
          }
        } catch (cleanupError) {
          logger.error('Error cleaning up admin keyframes style element', { details: { cleanupError } });
        }
      };
    }
    
    // Get theme colors with fallbacks
    const theme = currentTheme?.impulse;
    
    if (!theme && !styleElement) return;
    
    measure('updating-admin-keyframes', () => {
      try {
        // Get colors with fallbacks
        const primary = getThemeProperty(theme, 'colors.primary', FALLBACKS.primary);
        const secondary = getThemeProperty(theme, 'colors.secondary', FALLBACKS.secondary);
        const accent = getThemeProperty(theme, 'colors.accent', FALLBACKS.accent);
        const success = getThemeProperty(theme, 'colors.status.success', FALLBACKS.success);
        const warning = getThemeProperty(theme, 'colors.status.warning', FALLBACKS.warning);
        const error = getThemeProperty(theme, 'colors.status.error', FALLBACKS.error);
        
        // Convert to RGB format
        const primaryRgbString = hexToRgbString(primary);
        const secondaryRgbString = hexToRgbString(secondary);
        const accentRgbString = hexToRgbString(accent);
        
        // Store as CSS variables (backup method)
        document.documentElement.style.setProperty('--admin-effect-color', primary);
        document.documentElement.style.setProperty('--admin-effect-secondary', secondary);
        document.documentElement.style.setProperty('--admin-effect-tertiary', accent);
        document.documentElement.style.setProperty('--admin-success-color', success);
        document.documentElement.style.setProperty('--admin-warning-color', warning);
        document.documentElement.style.setProperty('--admin-error-color', error);
        
        // Update keyframes with current theme colors
        if (styleElement) {
          styleElement.textContent = `
            @keyframes admin-glow-pulse {
              0%, 100% { box-shadow: 0 0 5px ${primary}; }
              50% { box-shadow: 0 0 20px ${primary}; }
            }
            
            @keyframes admin-text-glow {
              0%, 100% { text-shadow: 0 0 2px ${primary}; }
              50% { text-shadow: 0 0 10px ${primary}; }
            }
            
            @keyframes admin-border-pulse {
              0%, 100% { border-color: ${primary}; }
              50% { border-color: ${secondary}; }
            }
            
            @keyframes admin-background-shift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            @keyframes admin-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }
            
            @keyframes admin-pulse {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 0.4; }
            }
            
            @keyframes admin-fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes admin-scale-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            
            @keyframes admin-scale-pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            
            @keyframes admin-cyber-glow {
              0%, 100% {
                box-shadow: 0 0 10px rgba(${primaryRgbString}, 0.8), 0 0 20px rgba(${primaryRgbString}, 0.5);
              }
              50% {
                box-shadow: 0 0 20px rgba(${primaryRgbString}, 0.8), 0 0 40px rgba(${primaryRgbString}, 0.5);
              }
            }
            
            @keyframes admin-data-stream {
              0% { background-position: 0% 0%; }
              100% { background-position: 200% 0%; }
            }
            
            @keyframes admin-hue-rotate {
              0% { filter: hue-rotate(0deg); }
              50% { filter: hue-rotate(30deg); }
              100% { filter: hue-rotate(0deg); }
            }
            
            @keyframes admin-rainbow-shift {
              0% { border-color: ${primary}; }
              33% { border-color: ${secondary}; }
              66% { border-color: ${accent}; }
              100% { border-color: ${primary}; }
            }
            
            @keyframes admin-highlight-flash {
              0% { background-color: rgba(${primaryRgbString}, 0); }
              50% { background-color: rgba(${primaryRgbString}, 0.2); }
              100% { background-color: rgba(${primaryRgbString}, 0); }
            }
            
            @keyframes admin-alert-pulse {
              0% { background-color: rgba(${hexToRgbString(error)}, 0.1); }
              50% { background-color: rgba(${hexToRgbString(error)}, 0.3); }
              100% { background-color: rgba(${hexToRgbString(error)}, 0.1); }
            }
            
            .admin-animate-glow-pulse { animation: admin-glow-pulse 2s ease-in-out infinite; }
            .admin-animate-text-glow { animation: admin-text-glow 2s ease-in-out infinite; }
            .admin-animate-border-pulse { animation: admin-border-pulse 4s ease-in-out infinite; }
            .admin-animate-float { animation: admin-float 3s ease-in-out infinite; }
            .admin-animate-pulse { animation: admin-pulse 3s ease-in-out infinite; }
            .admin-animate-scale-pulse { animation: admin-scale-pulse 2s ease-in-out infinite; }
            .admin-animate-fade-in { animation: admin-fade-in 0.3s ease-out forwards; }
            .admin-animate-scale-in { animation: admin-scale-in 0.3s ease-out forwards; }
            .admin-animate-rainbow { animation: admin-rainbow-shift 6s linear infinite; }
            .admin-animate-highlight { animation: admin-highlight-flash 2s ease-in-out; }
            .admin-animate-alert { animation: admin-alert-pulse 2s ease-in-out infinite; }
            
            .admin-bg-gradient-animated {
              background: linear-gradient(270deg, ${primary}, ${secondary});
              background-size: 200% 200%;
              animation: admin-background-shift 3s ease infinite;
            }
            
            .admin-cyber-glow { animation: admin-cyber-glow 3s ease-in-out infinite; }
            
            .admin-data-stream::before {
              content: '';
              position: absolute;
              inset: 0;
              width: 100%;
              background-image: linear-gradient(90deg, 
                rgba(16, 20, 24, 0) 0%,
                ${primary} 20%,
                ${secondary} 40%,
                ${accent} 60%,
                ${primary} 80%,
                rgba(16, 20, 24, 0) 100%
              );
              background-size: 200% 100%;
              animation: admin-data-stream 8s linear infinite;
              opacity: 0.3;
            }
            
            .admin-glass-morphism {
              background-color: rgba(${theme?.colors?.background?.card ? hexToRgbString(theme.colors.background.card) : '28, 32, 42'}, 0.7);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(${primaryRgbString}, 0.3);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .admin-neo-blur {
              backdrop-filter: blur(16px);
              background-color: rgba(0, 0, 0, 0.4);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .admin-hue-rotate { animation: admin-hue-rotate 10s infinite linear; }
            
            /* Status colors with animations */
            .admin-status-success {
              color: ${success};
              animation: admin-text-glow 2s ease-in-out infinite;
              text-shadow: 0 0 8px rgba(${hexToRgbString(success)}, 0.7);
            }
            
            .admin-status-warning {
              color: ${warning};
              animation: admin-text-glow 2s ease-in-out infinite;
              text-shadow: 0 0 8px rgba(${hexToRgbString(warning)}, 0.7);
            }
            
            .admin-status-error {
              color: ${error};
              animation: admin-text-glow 2s ease-in-out infinite;
              text-shadow: 0 0 8px rgba(${hexToRgbString(error)}, 0.7);
            }
            
            /* Button effects */
            .admin-button-hover {
              transition: all 0.2s ease;
            }
            
            .admin-button-hover:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(${primaryRgbString}, 0.3);
            }
            
            /* Card effects */
            .admin-card-glow {
              transition: all 0.3s ease;
              border: 1px solid rgba(${primaryRgbString}, 0.2);
            }
            
            .admin-card-glow:hover {
              border-color: rgba(${primaryRgbString}, 0.5);
              box-shadow: 0 0 20px rgba(${primaryRgbString}, 0.3);
            }
          `;
          
          logger.debug('Applied dynamic keyframes with theme colors');
        }
      } catch (error) {
        logger.error('Error updating admin dynamic keyframes', { details: { error } });
        
        // Ultra-minimal fallback in case of errors
        if (styleElement) {
          try {
            styleElement.textContent = `
              @keyframes admin-fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .admin-animate-fade-in { animation: admin-fade-in 0.3s ease-out forwards; }
              
              @keyframes admin-glow-pulse {
                0%, 100% { box-shadow: 0 0 5px ${FALLBACKS.primary}; }
                50% { box-shadow: 0 0 20px ${FALLBACKS.primary}; }
              }
              .admin-animate-glow-pulse { animation: admin-glow-pulse 2s ease-in-out infinite; }
            `;
            logger.debug('Applied fallback keyframes after error');
          } catch (fallbackError) {
            logger.error('Even fallback admin keyframes failed', { details: { fallbackError } });
          }
        }
      }
    });
  }, [styleElement, currentTheme, logger, measure]);
  
  return null; // This component doesn't render anything visible
}
