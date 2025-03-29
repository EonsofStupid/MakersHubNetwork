
// Keyframes definitions that will be used in the theme system
// These get synced to the database for dynamic usage
export const keyframes = {
  // Fade animations
  'fade-in': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  },
  'fade-out': {
    '0%': { opacity: '1', transform: 'translateY(0)' },
    '100%': { opacity: '0', transform: 'translateY(10px)' }
  },
  
  // Scale animations
  'scale-in': {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' }
  },
  'scale-out': {
    '0%': { transform: 'scale(1)', opacity: '1' },
    '100%': { transform: 'scale(0.95)', opacity: '0' }
  },
  
  // Float animations
  'float': {
    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
    '50%': { transform: 'translateY(-20px) rotate(5deg)' }
  },
  'footer-float': {
    '0%, 100%': { transform: 'perspective(1000px) rotateX(1deg) translateY(0)' },
    '50%': { transform: 'perspective(1000px) rotateX(2deg) translateY(-10px)' }
  },
  
  // Morph animations
  'morph-header': {
    '0%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: 'translateZ(0)' },
    '100%': { clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)', transform: 'translateZ(20px)' }
  },
  'morph-shape': {
    '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
    '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }
  },
  
  // Pulse animations
  'pulse-slow': {
    '0%': { opacity: '0.4', transform: 'translateY(0)' },
    '50%': { opacity: '0.1', transform: 'translateY(-100vh)' },
    '100%': { opacity: '0.4', transform: 'translateY(-200vh)' }
  },
  'pulse': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' }
  },
  
  // Gradient flow
  'gradient': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' }
  },
  
  // Shimmer effect
  'shimmer': {
    '0%': { left: '-100%' },
    '100%': { left: '150%' }
  },
  
  // Stream effects
  'stream-vertical': {
    '0%': { transform: 'translateY(-100%)' },
    '100%': { transform: 'translateY(100vh)' }
  },
  'stream-horizontal': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100vw)' }
  },
  
  // Data stream
  'data-stream': {
    '0%': { backgroundPosition: '0% 0%' },
    '100%': { backgroundPosition: '200% 0%' }
  },
  
  // Cyber effects
  'cyber-glitch': {
    '0%': { transform: 'translate(0)', textShadow: '0 0 0 var(--effect-color, #00F0FF)' },
    '25%': { transform: 'translate(-2px, 2px)', textShadow: '-1px 0 2px var(--effect-color, #00F0FF)' },
    '50%': { transform: 'translate(0)', textShadow: '0 0 0 var(--effect-color, #00F0FF)' },
    '75%': { transform: 'translate(2px, -2px)', textShadow: '1px 0 2px var(--effect-color, #00F0FF)' },
    '100%': { transform: 'translate(0)', textShadow: '0 0 0 var(--effect-color, #00F0FF)' }
  },
  'cyber-scanlines': {
    '0%': { backgroundPosition: '0 0' },
    '100%': { backgroundPosition: '0 100%' }
  }
};

// Animation definitions
export const animation = {
  'fade-in': 'fade-in 0.3s ease-in-out forwards',
  'fade-out': 'fade-out 0.3s ease-in-out forwards',
  'scale-in': 'scale-in 0.2s ease-out forwards',
  'scale-out': 'scale-out 0.2s ease-out forwards',
  'float': 'float 5s ease-in-out infinite',
  'footer-float': 'footer-float 5s ease-in-out infinite',
  'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'pulse-slow': 'pulse-slow 10s linear infinite',
  'gradient-flow': 'gradient 3s ease infinite',
  'shimmer': 'shimmer 2s infinite',
  'morph-header': 'morph-header 3s ease-in-out infinite alternate',
  'morph-shape': 'morph-shape 10s infinite',
  'stream-vertical': 'stream-vertical 8s linear infinite',
  'stream-horizontal': 'stream-horizontal 12s linear infinite',
  'data-stream': 'data-stream 2s linear infinite'
};
