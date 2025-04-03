
/**
 * ImpulseTheme interface defines the complete theme structure
 * for the Impulse theming system
 */
export interface ImpulseTheme {
  id?: string;
  name: string;
  version?: string;
  description?: string;
  
  // Core color tokens
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    
    // Background variations
    background: {
      main: string;
      overlay?: string;
      card?: string;
      alt?: string;
    };
    
    // Text variations
    text: {
      primary: string;
      secondary?: string;
      accent?: string;
      muted?: string;
    };
    
    // Border variations
    borders?: {
      normal?: string;
      hover?: string;
      active?: string;
      focus?: string;
    };
    
    // Status colors
    status?: {
      success?: string;
      warning?: string;
      error?: string;
      info?: string;
    };
  };
  
  // Visual effects
  effects?: {
    glow?: {
      primary?: string;
      secondary?: string;
      hover?: string;
    };
    gradients?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    shadows?: {
      small?: string;
      medium?: string;
      large?: string;
      inner?: string;
    };
  };
  
  // Animation parameters
  animation?: {
    duration?: {
      fast?: string;
      normal?: string;
      slow?: string;
    };
    curves?: {
      bounce?: string;
      ease?: string;
      spring?: string;
      linear?: string;
    };
    keyframes?: Record<string, string>;
  };
  
  // Component-specific styling
  components?: {
    panel?: {
      radius?: string;
      padding?: string;
      background?: string;
    };
    button?: {
      radius?: string;
      padding?: string;
      transition?: string;
    };
    tooltip?: {
      radius?: string;
      padding?: string;
      background?: string;
    };
    input?: {
      radius?: string;
      padding?: string;
      background?: string;
    };
  };
  
  // Typography settings
  typography?: {
    fonts?: {
      body?: string;
      heading?: string;
      monospace?: string;
    };
    sizes?: {
      xs?: string;
      sm?: string;
      base?: string;
      lg?: string;
      xl?: string;
      '2xl'?: string;
      '3xl'?: string;
      md?: string;
    };
    weights?: {
      light?: number;
      normal?: number;
      medium?: number;
      bold?: number;
    };
    lineHeights?: {
      tight?: string;
      normal?: string;
      loose?: string;
    };
  };
}

/**
 * Default Impulse theme tokens - Cyberpunk inspired
 */
export const defaultImpulseTokens: ImpulseTheme = {
  name: 'Impulsivity',
  description: 'Default cyberpunk-inspired theme for MakersImpulse',
  version: '1.0.0',
  
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#8B5CF6',
    
    background: {
      main: '#12121A',
      overlay: 'rgba(18, 18, 26, 0.8)',
      card: '#1A1F2C',
      alt: '#131D35'
    },
    
    text: {
      primary: '#F6F6F7',
      secondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#00F0FF',
      muted: 'rgba(255, 255, 255, 0.5)'
    },
    
    borders: {
      normal: 'rgba(0, 240, 255, 0.2)',
      hover: 'rgba(0, 240, 255, 0.4)',
      active: 'rgba(0, 240, 255, 0.6)',
      focus: 'rgba(0, 240, 255, 0.8)'
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
      primary: '0 0 10px rgba(0, 240, 255, 0.5)',
      secondary: '0 0 10px rgba(255, 45, 110, 0.5)',
      hover: '0 0 15px rgba(0, 240, 255, 0.8)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00F0FF 0%, #0FB4FF 100%)',
      secondary: 'linear-gradient(135deg, #FF2D6E 0%, #FF9580 100%)',
      accent: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)'
    },
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.3)',
      medium: '0 4px 8px rgba(0, 0, 0, 0.5)',
      large: '0 8px 16px rgba(0, 0, 0, 0.7)',
      inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
    }
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    curves: {
      bounce: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      spring: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
      linear: 'linear'
    }
  },
  
  components: {
    panel: {
      radius: '0.5rem',
      padding: '1.5rem',
      background: 'rgba(26, 31, 44, 0.8)'
    },
    button: {
      radius: '0.375rem',
      padding: '0.75rem 1.5rem',
      transition: '150ms'
    },
    tooltip: {
      radius: '0.25rem',
      padding: '0.5rem',
      background: 'rgba(18, 18, 26, 0.9)'
    },
    input: {
      radius: '0.375rem',
      padding: '0.75rem 1rem',
      background: 'rgba(19, 29, 53, 0.5)'
    }
  },
  
  typography: {
    fonts: {
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      monospace: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
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
  }
};
