
/**
 * MakersImpulse Theme Configuration
 * 
 * This file provides central configuration and typing for the theme system.
 * It helps ensure consistency across the site and admin areas.
 */

// Theme Types
export type ThemeMode = 'dark' | 'light' | 'system';
export type SiteTheme = 'Impulsivity' | 'Classic' | 'Minimal';
export type AdminTheme = 'cyberpunk' | 'neon' | 'minimal' | 'dark' | 'light';

// Core Theme Settings
export const coreThemeSettings = {
  defaultMode: 'dark' as ThemeMode,
  defaultSiteTheme: 'Impulsivity' as SiteTheme,
  defaultAdminTheme: 'cyberpunk' as AdminTheme,
};

// Color Palette
// These are transformed into CSS variables in site-theme.css
export const colorPalette = {
  // Primary colors
  primary: {
    main: '#00F0FF', // Cyan
    light: '#7AF7FF',
    dark: '#00C6D4',
  },
  
  // Secondary colors
  secondary: {
    main: '#FF2D6E', // Pink
    light: '#FF689B',
    dark: '#D10046', 
  },
  
  // Accent colors
  accent: {
    main: '#F97316', // Orange
    light: '#FB9C51',
    dark: '#D35400',
  },
  
  // Background colors
  background: {
    dark: '#080F1E',
    card: '#121218',
    overlay: 'rgba(22, 24, 29, 0.85)',
  },
  
  // Text colors
  text: {
    primary: '#F6F6F7',
    secondary: 'rgba(255, 255, 255, 0.7)',
    accent: '#00F0FF',
  },
  
  // UI colors
  border: 'rgba(0, 240, 255, 0.2)',
  borderHover: 'rgba(0, 240, 255, 0.4)',
  borderActive: 'rgba(0, 240, 255, 0.6)',
  
  // Effect colors
  glow: {
    primary: '0 0 15px rgba(0, 240, 255, 0.7)',
    secondary: '0 0 15px rgba(255, 45, 110, 0.7)',
  },
};

// Animation Timings
export const animationTimings = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  
  // Animation durations
  animationFast: '1s',
  animationNormal: '2s',
  animationSlow: '3s',
};

// Border Radius
export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  full: '9999px',
};

// Z-Index Layers
export const zLayers = {
  base: 0,
  above: 10,
  modal: 100,
  tooltip: 150,
  toast: 200,
  maximum: 999,
};

// Animation Curves
export const animationCurves = {
  bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
};

// Export theme configuration
export const themeConfig = {
  core: coreThemeSettings,
  colors: colorPalette,
  animations: animationTimings,
  radius: borderRadius,
  zLayers: zLayers,
  curves: animationCurves,
};

export default themeConfig;
