
/**
 * ImpulseTheme - Application-specific theme structure used internally
 * This is different from the database Theme model
 */
export interface ImpulseTheme {
  id: string;
  name: string;
  version: string;
  description?: string;
  
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    
    background: {
      main: string;
      overlay: string;
      card: string;
      alt: string;
    };
    
    text: {
      primary: string;
      secondary: string;
      accent: string;
      muted: string;
    };
    
    borders: {
      normal: string;
      hover: string;
      active: string;
      focus: string;
    };
    
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  
  effects: {
    glow: {
      primary: string;
      secondary: string;
      hover: string;
    };
    
    gradients: {
      primary: string;
      secondary: string;
      accent: string;
    };
    
    shadows: {
      small: string;
      medium: string;
      large: string;
      inner: string;
    };
  };
  
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
      linear: string;
    };
    
    keyframes: {
      fade: string;
      pulse: string;
      glow: string;
      slide: string;
    };
  };
  
  components: {
    panel: {
      radius: string;
      padding: string;
      background: string;
    };
    
    button: {
      radius: string;
      padding: string;
      transition: string;
    };
    
    tooltip: {
      radius: string;
      padding: string;
      background: string;
    };
    
    input: {
      radius: string;
      padding: string;
      background: string;
    };
  };
  
  typography: {
    fonts: {
      body: string;
      heading: string;
      monospace: string;
    };
    
    sizes: {
      xs: string;
      sm: string;
      base: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    
    weights: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
    
    lineHeights: {
      tight: string;
      normal: string;
      loose: string;
    };
  };
}

/**
 * Default ImpulseTheme tokens for fallback
 */
export const defaultImpulseTokens: ImpulseTheme = {
  id: 'default-impulse',
  name: 'Impulsivity',
  version: '1.0.0',
  
  // Color tokens
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#F97316',
    
    background: {
      main: '#12121A',
      overlay: 'rgba(22, 24, 29, 0.85)',
      card: 'rgba(28, 32, 42, 0.7)',
      alt: '#1A1E24',
    },
    
    text: {
      primary: '#F6F6F7',
      secondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#00F0FF',
      muted: 'rgba(255, 255, 255, 0.5)',
    },
    
    borders: {
      normal: 'rgba(0, 240, 255, 0.2)',
      hover: 'rgba(0, 240, 255, 0.4)',
      active: 'rgba(0, 240, 255, 0.6)',
      focus: 'rgba(0, 240, 255, 0.5)',
    },
    
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  
  // Effect tokens
  effects: {
    glow: {
      primary: '0 0 15px rgba(0, 240, 255, 0.7)',
      secondary: '0 0 15px rgba(255, 45, 110, 0.7)',
      hover: '0 0 20px rgba(0, 240, 255, 0.9)',
    },
    
    gradients: {
      primary: 'linear-gradient(90deg, #00F0FF, #00B8D4)',
      secondary: 'linear-gradient(90deg, #FF2D6E, #FF5252)',
      accent: 'linear-gradient(90deg, #F97316, #FB923C)',
    },
    
    shadows: {
      small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
      large: '0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.22)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)',
    },
  },
  
  // Animation tokens
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    
    curves: {
      bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
      linear: 'linear',
    },
    
    keyframes: {
      fade: `
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
      pulse: `
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
      `,
      glow: `
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.5); }
          50% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.7); }
        }
      `,
      slide: `
        @keyframes slide {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,
    },
  },
  
  // Component tokens
  components: {
    panel: {
      radius: '0.75rem',
      padding: '1.5rem',
      background: 'rgba(28, 32, 42, 0.7)',
    },
    
    button: {
      radius: '0.5rem',
      padding: '0.5rem 1rem',
      transition: 'all 0.2s ease',
    },
    
    tooltip: {
      radius: '0.25rem',
      padding: '0.5rem',
      background: 'rgba(0, 0, 0, 0.8)',
    },
    
    input: {
      radius: '0.375rem',
      padding: '0.5rem 0.75rem',
      background: 'rgba(0, 0, 0, 0.15)',
    },
  },
  
  // Typography tokens
  typography: {
    fonts: {
      body: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      monospace: 'Consolas, monospace',
    },
    
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      md: '1rem',
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
      loose: '1.75',
    },
  },
};
