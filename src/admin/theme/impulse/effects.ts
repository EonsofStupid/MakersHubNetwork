
/**
 * Impulse theme effect definitions
 * These are ready-to-use effects that can be applied to components
 */

export interface ImpulseEffect {
  name: string;
  description: string;
  cssClass: string;
  cssProperties?: Record<string, string>;
}

export const impulseEffects: Record<string, ImpulseEffect> = {
  glow: {
    name: 'Glow',
    description: 'Adds a subtle glow effect to elements',
    cssClass: 'impulse-effect-glow',
    cssProperties: {
      'box-shadow': 'var(--impulse-glow-primary)'
    }
  },
  
  pulse: {
    name: 'Pulse',
    description: 'Creates a pulsing animation effect',
    cssClass: 'impulse-effect-pulse',
    cssProperties: {
      'animation': 'impulse-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }
  },
  
  shimmer: {
    name: 'Shimmer',
    description: 'Adds a shimmering highlight effect',
    cssClass: 'impulse-effect-shimmer',
    cssProperties: {
      'background': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      'background-size': '200% 100%',
      'animation': 'impulse-shimmer 2s infinite'
    }
  },
  
  gradient: {
    name: 'Gradient',
    description: 'Applies a gradient background',
    cssClass: 'impulse-effect-gradient',
    cssProperties: {
      'background': 'var(--impulse-gradients-accent)',
      'color': 'white'
    }
  },
  
  morphBorder: {
    name: 'Morph Border',
    description: 'Creates a morphing border animation',
    cssClass: 'impulse-effect-morph-border',
    cssProperties: {
      'border': '2px solid transparent',
      'background-clip': 'padding-box',
      'position': 'relative'
    }
  },
  
  neon: {
    name: 'Neon',
    description: 'Adds a vibrant neon glow effect',
    cssClass: 'impulse-effect-neon',
    cssProperties: {
      'text-shadow': '0 0 5px var(--impulse-primary), 0 0 10px var(--impulse-primary)',
      'color': 'white'
    }
  }
};

// CSS animations for the effects
export const effectsAnimations = `
@keyframes impulse-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes impulse-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes impulse-morph-border {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
}
`;
