
import { ImpulseTheme } from '@/admin/types/impulse.types';

/**
 * Fallback theme used when other theme loading methods fail
 * Focused on critical path - guaranteed to render correctly
 */
export const fallbackImpulseTheme: ImpulseTheme = {
  name: 'Emergency Fallback',
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#8B5CF6',
    background: {
      main: '#12121A',
      card: 'rgba(28, 32, 42, 0.7)'
    },
    text: {
      primary: '#F6F6F7',
      secondary: 'rgba(255, 255, 255, 0.7)'
    },
    borders: {
      normal: 'rgba(0, 240, 255, 0.2)'
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    }
  },
  typography: {
    fonts: {
      body: 'system-ui, sans-serif',
      heading: 'system-ui, sans-serif'
    }
  },
  components: {
    panel: {
      radius: '0.75rem'
    },
    button: {
      radius: '0.5rem'
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
