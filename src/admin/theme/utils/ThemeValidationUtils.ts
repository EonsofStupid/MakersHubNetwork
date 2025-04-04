
/**
 * Theme validation utility functions
 */

import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { applyEmergencyTheme } from './themeApplicator';

const logger = getLogger('ThemeValidation', { category: LogCategory.THEME });

/**
 * Validate that critical theme variables are properly set
 * @returns boolean True if theme is valid, false otherwise
 */
export function validateThemeVariables(): boolean {
  try {
    const styles = getComputedStyle(document.documentElement);
    
    // Check critical variables
    const criticalVars = [
      '--color-primary',
      '--color-secondary',
      '--color-background',
      '--color-foreground',
      '--color-primary-rgb',
      '--animation-duration-normal'
    ];
    
    // Validate all critical variables have values
    for (const varName of criticalVars) {
      const value = styles.getPropertyValue(varName).trim();
      if (!value) {
        logger.warn(`Missing critical CSS variable: ${varName}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logger.error('Theme validation error', { 
      details: { error: error instanceof Error ? error.message : 'Unknown error' } 
    });
    return false;
  }
}

/**
 * Apply emergency theme to ensure the UI is usable
 */
export function applyEmergencyFallback(): void {
  try {
    logger.info('Applying emergency theme fallback');
    applyEmergencyTheme();
    
    // Add a data attribute for debugging
    document.documentElement.setAttribute('data-theme-fallback', 'emergency');
  } catch (error) {
    logger.error('Failed to apply emergency fallback', { 
      details: { error: error instanceof Error ? error.message : 'Unknown error' } 
    });
    
    // Last resort - direct styling
    try {
      document.documentElement.style.backgroundColor = '#12121A';
      document.documentElement.style.color = '#F6F6F7';
      document.body.style.backgroundColor = '#12121A';
      document.body.style.color = '#F6F6F7';
    } catch (e) {
      // Nothing more we can do
    }
  }
}

/**
 * Assert that a theme is properly applied, apply emergency fallback if not
 */
export function assertThemeApplied(): boolean {
  const isValid = validateThemeVariables();
  
  if (!isValid) {
    logger.warn('Theme variables not properly set, applying emergency fallback');
    applyEmergencyFallback();
    return false;
  }
  
  return true;
}

/**
 * Log the current theme state for debugging
 */
export function logThemeState(): void {
  try {
    const styles = getComputedStyle(document.documentElement);
    
    // Log key theme variables
    const themeVars = {
      primary: styles.getPropertyValue('--color-primary').trim(),
      secondary: styles.getPropertyValue('--color-secondary').trim(),
      background: styles.getPropertyValue('--color-background').trim(),
      foreground: styles.getPropertyValue('--color-foreground').trim(),
      accentColor: styles.getPropertyValue('--color-accent').trim(),
      primaryRgb: styles.getPropertyValue('--color-primary-rgb').trim(),
      dataThemeId: document.documentElement.getAttribute('data-theme-id'),
      dataThemeStatus: document.documentElement.getAttribute('data-theme-status'),
      classes: document.documentElement.className
    };
    
    logger.debug('Current theme state', { details: themeVars });
  } catch (error) {
    logger.error('Failed to log theme state', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}

/**
 * Generate a warning if any critical theme components are missing
 */
export function warnAboutMissingThemeComponents(): void {
  // Check for required CSS files
  const requiredCssFiles = [
    'impulse-theme.css',
    'impulse-admin.css',
    'impulse.css'
  ];
  
  // Check if animation styles are applied
  const animationStylesTags = document.querySelectorAll('style[id*="theme-keyframes"]');
  if (animationStylesTags.length === 0) {
    logger.warn('No animation keyframes found in document');
  }
  
  // Check stylesheet links
  const stylesheets = Array.from(document.styleSheets);
  const missingFiles: string[] = [];
  
  for (const file of requiredCssFiles) {
    const hasFile = stylesheets.some(sheet => {
      try {
        return sheet.href?.includes(file);
      } catch {
        return false;
      }
    });
    
    if (!hasFile) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    logger.warn('Missing theme CSS files', { details: { missingFiles } });
  }
}

/**
 * Import animation keyframes CSS into document
 */
export function importAnimationKeyframes(): void {
  try {
    // Create style element for animations
    const styleElement = document.createElement('style');
    styleElement.id = 'theme-animations-keyframes';
    
    // Define keyframes
    styleElement.textContent = `
      /* Fade animations */
      @keyframes theme-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes theme-fade-out {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      /* Scale animations */
      @keyframes theme-scale-in {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      @keyframes theme-scale-out {
        from { transform: scale(1); opacity: 1; }
        to { transform: scale(0.95); opacity: 0; }
      }
      
      /* Slide animations */
      @keyframes theme-slide-in-right {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes theme-slide-in-left {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      /* Glow animations */
      @keyframes theme-glow {
        0%, 100% { box-shadow: 0 0 5px var(--color-primary); }
        50% { box-shadow: 0 0 15px var(--color-primary); }
      }
      
      /* Preset animation classes */
      .animate-fade-in {
        animation: theme-fade-in var(--animation-duration-normal, 300ms) var(--animation-curve-ease, ease-out) forwards;
      }
      
      .animate-scale-in {
        animation: theme-scale-in var(--animation-duration-normal, 300ms) var(--animation-curve-bounce, cubic-bezier(0.175, 0.885, 0.32, 1.275)) forwards;
      }
      
      .animate-glow-pulse {
        animation: theme-glow 2s infinite;
      }
      
      .animate-slide-in-right {
        animation: theme-slide-in-right var(--animation-duration-normal, 300ms) var(--animation-curve-ease, ease-out) forwards;
      }
      
      .animate-slide-in-left {
        animation: theme-slide-in-left var(--animation-duration-normal, 300ms) var(--animation-curve-ease, ease-out) forwards;
      }
    `;
    
    // Add to document if not already present
    if (!document.getElementById('theme-animations-keyframes')) {
      document.head.appendChild(styleElement);
      logger.debug('Animation keyframes imported');
    }
  } catch (error) {
    logger.error('Failed to import animation keyframes', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}
