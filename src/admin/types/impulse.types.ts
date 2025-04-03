
import { ThemeColors, ThemeEffects, ThemeAnimation, ThemeComponents, ThemeTypography } from '@/types/theme';

export interface ImpulseTheme {
  // Basic metadata properties
  id?: string;
  name?: string;
  description?: string;
  version?: string;
  
  // Theme sections
  colors?: ThemeColors;
  effects?: ThemeEffects;
  animation?: ThemeAnimation;
  components?: ThemeComponents;
  typography?: ThemeTypography;
  
  // Allow custom keyframes
  keyframes?: Record<string, string>;
}

// Default fallback theme
export const defaultImpulseTokens: ImpulseTheme = {
  id: "impulse-default",
  name: "Impulse Default",
  description: "Default theme for Impulse applications",
  version: "1.0.0",
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#8B5CF6',
    background: {
      main: '#12121A',
      overlay: 'rgba(18, 18, 26, 0.8)',
      card: 'rgba(28, 32, 42, 0.7)', 
      alt: '#131D35',
    },
    text: {
      primary: '#F6F6F7',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.5)',
      accent: '#00F0FF',
    },
    borders: {
      normal: 'rgba(0, 240, 255, 0.2)',
      hover: 'rgba(0, 240, 255, 0.4)',
      active: 'rgba(0, 240, 255, 0.6)',
      focus: 'rgba(0, 240, 255, 0.8)',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    }
  },
  effects: {
    glow: {
      primary: '0 0 10px rgba(0, 240, 255, 0.7)',
      secondary: '0 0 10px rgba(255, 45, 110, 0.7)',
      hover: '0 0 15px rgba(0, 240, 255, 0.9)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00F0FF 0%, #0090FF 100%)',
      secondary: 'linear-gradient(135deg, #FF2D6E 0%, #FF7446 100%)',
      accent: 'linear-gradient(135deg, #7E69AB 0%, #8B5CF6 100%)',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
      md: '0 4px 6px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
    },
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    tertiary: '#8B5CF6',
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    curves: {
      bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      ease: 'cubic-bezier(0.42, 0, 0.58, 1)',
      spring: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
      linear: 'linear',
    },
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      animationFast: '1s',
      animationNormal: '2s',
      animationSlow: '3s',
    },
    keyframes: {
      fadeIn: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
      slideIn: '@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
      pulse: '@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }',
      glowPulse: '@keyframes glowPulse { 0% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.7); } 50% { box-shadow: 0 0 15px rgba(0, 240, 255, 0.9); } 100% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.7); } }',
    }
  },
  components: {
    panel: {
      radius: '0.5rem',
      padding: '1.5rem',
      background: 'rgba(19, 29, 53, 0.7)',
    },
    button: {
      radius: '0.375rem',
      padding: '0.5rem 1rem',
      transition: '150ms',
    },
    tooltip: {
      radius: '0.25rem',
      padding: '0.5rem',
      background: 'rgba(10, 10, 15, 0.9)',
    },
    input: {
      radius: '0.375rem',
      padding: '0.5rem',
      background: 'rgba(19, 29, 53, 0.5)',
    }
  },
  typography: {
    fonts: {
      body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    }
  }
};
