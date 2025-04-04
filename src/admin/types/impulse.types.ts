
/**
 * Core ImpulseTheme type definition
 */
export interface ImpulseTheme {
  id: string;
  name: string;
  version: number;
  description?: string;
  
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background: {
      main: string;
      overlay: string;
      card: string;
      alt: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      accent: string;
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
  
  typography: {
    fonts: {
      body: string;
      heading: string;
      mono: string;
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
      relaxed: string;
    };
  };
  
  effects: {
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    glow: {
      primary: string;
      secondary: string;
      hover: string;
    };
    gradients?: Record<string, string>;
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
    keyframes?: Record<string, string>;
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
}

/**
 * Default tokens used as fallback
 */
export const defaultImpulseTokens: ImpulseTheme = {
  id: 'default',
  name: "Default Theme",
  version: 1,
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#8B5CF6',
    background: { 
      main: '#12121A',
      overlay: 'rgba(22, 24, 29, 0.85)',
      card: 'rgba(28, 32, 42, 0.7)',
      alt: '#1A1E24'
    },
    text: { 
      primary: '#F6F6F7',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.5)',
      accent: '#00F0FF'
    },
    borders: {
      normal: 'rgba(0, 240, 255, 0.2)',
      hover: 'rgba(0, 240, 255, 0.4)',
      active: 'rgba(0, 240, 255, 0.6)',
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
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 25px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    glow: {
      primary: '0 0 15px rgba(0, 240, 255, 0.5)',
      secondary: '0 0 15px rgba(255, 45, 110, 0.5)',
      hover: '0 0 20px rgba(0, 240, 255, 0.7)'
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
      spring: 'cubic-bezier(0.155, 1.105, 0.295, 1.12)',
      linear: 'linear'
    }
  },
  components: {
    panel: {
      radius: '0.5rem',
      padding: '1.5rem',
      background: 'rgba(28, 32, 42, 0.7)'
    },
    button: {
      radius: '0.375rem',
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
      padding: '0.5rem',
      background: 'rgba(28, 32, 42, 0.7)'
    }
  },
  typography: {
    fonts: {
      body: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      mono: 'Consolas, Monaco, monospace'
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      md: '1.1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
      '3xl': '2.5rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700
    },
    lineHeights: {
      tight: '1.1',
      normal: '1.5',
      relaxed: '1.8'
    }
  }
};
