
import { ImpulseTheme } from '@/admin/types/impulse.types';

/**
 * Fallback theme used when other theme loading methods fail
 * Focused on critical path - guaranteed to render correctly
 */
export const fallbackImpulseTheme: ImpulseTheme = {
  id: 'fallback-theme',
  name: 'Emergency Fallback',
  version: '1.0.0',
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#8B5CF6',
    background: {
      main: '#12121A',
      card: 'rgba(28, 32, 42, 0.7)',
      overlay: 'rgba(0, 0, 0, 0.7)',
      alt: '#1A1E24'
    },
    text: {
      primary: '#F6F6F7',
      secondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#00F0FF',
      muted: 'rgba(255, 255, 255, 0.5)'
    },
    borders: {
      normal: 'rgba(0, 240, 255, 0.2)',
      hover: 'rgba(0, 240, 255, 0.3)',
      active: 'rgba(0, 240, 255, 0.4)',
      focus: 'rgba(0, 240, 255, 0.5)'
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  },
  effects: {
    glow: {
      primary: '0 0 15px rgba(0, 240, 255, 0.7)',
      secondary: '0 0 15px rgba(255, 45, 110, 0.7)',
      hover: '0 0 20px rgba(0, 240, 255, 0.9)'
    },
    gradients: {
      primary: 'linear-gradient(90deg, #00F0FF, #00B8D4)',
      secondary: 'linear-gradient(90deg, #FF2D6E, #FF5252)',
      accent: 'linear-gradient(90deg, #8B5CF6, #7C3AED)'
    },
    shadows: {
      small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
      large: '0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.22)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)'
    }
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    curves: {
      bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
      linear: 'linear'
    },
    keyframes: {
      fade: '@keyframes fade { from { opacity: 0; } to { opacity: 1; } }',
      pulse: '@keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.4; } }',
      glow: '@keyframes glow { 0%, 100% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.5); } 50% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.7); } }',
      slide: '@keyframes slide { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }'
    }
  },
  typography: {
    fonts: {
      body: 'system-ui, sans-serif',
      heading: 'system-ui, sans-serif',
      monospace: 'Consolas, monospace'
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      loose: '1.75'
    }
  },
  components: {
    panel: {
      radius: '0.75rem',
      padding: '1.5rem',
      background: 'rgba(28, 32, 42, 0.7)'
    },
    button: {
      radius: '0.5rem',
      padding: '0.5rem 1rem',
      transition: 'all 0.2s ease'
    },
    tooltip: {
      radius: '0.25rem',
      padding: '0.5rem',
      background: 'rgba(0, 0, 0, 0.8)'
    },
    input: {
      radius: '0.375rem',
      padding: '0.5rem 0.75rem',
      background: 'rgba(0, 0, 0, 0.15)'
    }
  }
};

/**
 * CSS variables version of the fallback theme
 * For direct application to HTML root
 */
export const fallbackCssVariables = {
  // Basic colors
  '--color-primary': '0, 240, 255',  // rgb format for utilities
  '--color-secondary': '255, 45, 110',
  '--color-accent': '139, 92, 246',
  '--color-background': '18, 18, 26',
  '--color-card': '28, 32, 42',
  '--color-text': '246, 246, 247',
  '--color-text-secondary': '255, 255, 255',
  '--color-border': '0, 240, 255',
  
  // Status colors
  '--color-success': '16, 185, 129',
  '--color-warning': '245, 158, 11',
  '--color-error': '239, 68, 68',
  
  // Radii
  '--radius-panel': '0.75rem',
  '--radius-button': '0.5rem',
  
  // Typography
  '--font-body': 'system-ui, sans-serif',
  '--font-heading': 'system-ui, sans-serif',
  
  // Important HSL variables for Tailwind
  '--background': '240 18% 9%',
  '--foreground': '240 10% 96%',
  '--primary': '186 100% 50%',
  '--primary-foreground': '240 10% 96%',
  '--secondary': '334 100% 59%',
  '--secondary-foreground': '240 10% 96%',
  '--muted': '240 18% 20%',
  '--muted-foreground': '240 10% 80%',
  '--accent': '260 86% 66%',
  '--accent-foreground': '240 10% 96%',
  '--card': '240 18% 14%',
  '--card-foreground': '240 10% 96%',
  '--border': '186 100% 10%',
  '--input': '240 18% 14%',
  '--ring': '186 100% 50%'
};

/**
 * Apply emergency fallback styles directly to the DOM
 * Used when theme loading fails completely
 */
export function applyFallbackStyles(): void {
  const root = document.documentElement;
  
  // Apply all fallback CSS variables
  Object.entries(fallbackCssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Set direct background and text properties for immediate visibility
  document.body.style.backgroundColor = '#12121A';
  document.body.style.color = '#F6F6F7';
  
  // Add data attributes for debugging
  root.setAttribute('data-theme-id', 'fallback');
  root.setAttribute('data-theme-status', 'emergency-fallback');
  
  // Add classes for styling
  root.classList.add('dark');
  root.classList.add('impulse-theme-emergency');
}
