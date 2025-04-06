
/**
 * Type definitions for Impulse theme system
 */

export interface ImpulseTheme {
  // Color palette
  colors: {
    primary: string;
    secondary: string;
    tertiary?: string;
    background: {
      main: string;
      card: string;
      overlay: string;
    };
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    borders: {
      normal: string;
      hover: string;
      active: string;
    };
    [key: string]: any;
  };
  
  // Effect settings
  effects: {
    glow: {
      primary: string;
      secondary: string;
      hover: string;
    };
    blur: {
      background: string;
      overlay: string;
    };
    gradients: {
      main: string;
      accent: string;
      card: string;
    };
    [key: string]: any;
  };
  
  // Animation settings
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    curves: {
      bounce: string;
      ease: string;
      spring: string;
    };
    [key: string]: any;
  };
  
  // UI component variants
  components?: {
    panel: {
      borderRadius: string;
      padding: string;
    };
    button: {
      borderRadius: string;
      padding: string;
    };
    tooltip: {
      borderRadius: string;
      padding: string;
    };
    [key: string]: any;
  };
  
  // Optional metadata
  meta?: {
    name?: string;
    description?: string;
    author?: string;
    version?: string;
    [key: string]: string | undefined;
  };
  
  // Allow additional properties
  [key: string]: any;
}
