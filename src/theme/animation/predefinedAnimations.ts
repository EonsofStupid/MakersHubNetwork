
import { AnimationConfig } from './useAnimationSystem';

export const CYBER_ANIMATIONS: Record<string, AnimationConfig> = {
  'glitch': {
    id: 'glitch',
    duration: 800,
    iterations: 1,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: [
      { offset: 0, properties: { transform: 'translate(0)' } },
      { offset: 0.1, properties: { transform: 'translate(-5px, 5px)' } },
      { offset: 0.2, properties: { transform: 'translate(0)' } },
      { offset: 0.3, properties: { transform: 'translate(5px, -5px)' } },
      { offset: 0.4, properties: { transform: 'translate(0)' } },
      { offset: 0.5, properties: { transform: 'translate(-3px, 2px)' } },
      { offset: 0.6, properties: { transform: 'translate(0)' } },
      { offset: 0.7, properties: { transform: 'translate(3px, -2px)' } },
      { offset: 0.8, properties: { transform: 'translate(0)' } },
      { offset: 0.9, properties: { transform: 'translate(-2px, 1px)' } },
      { offset: 1, properties: { transform: 'translate(0)' } }
    ]
  },
  
  'pulse': {
    id: 'pulse',
    duration: 2000,
    iterations: 'infinite',
    easing: 'ease-in-out',
    keyframes: [
      { offset: 0, properties: { opacity: 0.5, boxShadow: '0 0 5px var(--effect-color, #00F0FF)' } },
      { offset: 0.5, properties: { opacity: 1, boxShadow: '0 0 20px var(--effect-color, #00F0FF)' } },
      { offset: 1, properties: { opacity: 0.5, boxShadow: '0 0 5px var(--effect-color, #00F0FF)' } }
    ]
  },
  
  'scanline': {
    id: 'scanline',
    duration: 3000,
    iterations: 'infinite',
    easing: 'linear',
    keyframes: [
      { 
        offset: 0, 
        properties: { 
          backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 240, 255, 0.1) 50%)',
          backgroundSize: '100% 4px',
          backgroundPosition: '0 -100%'
        } 
      },
      { 
        offset: 1, 
        properties: { 
          backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 240, 255, 0.1) 50%)',
          backgroundSize: '100% 4px',
          backgroundPosition: '0 200%'
        } 
      }
    ]
  },
  
  'data-stream': {
    id: 'data-stream',
    duration: 15000,
    iterations: 'infinite',
    easing: 'linear',
    keyframes: [
      { 
        offset: 0, 
        properties: { 
          backgroundImage: 'linear-gradient(90deg, transparent 0%, var(--effect-color, #00F0FF) 20%, transparent 40%)',
          backgroundSize: '200% 100%',
          backgroundPosition: '0% 0%'
        } 
      },
      { 
        offset: 1, 
        properties: { 
          backgroundImage: 'linear-gradient(90deg, transparent 0%, var(--effect-color, #00F0FF) 20%, transparent 40%)',
          backgroundSize: '200% 100%',
          backgroundPosition: '200% 0%'
        } 
      }
    ]
  },
  
  'morph': {
    id: 'morph',
    duration: 3000,
    iterations: 'infinite',
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    direction: 'alternate',
    keyframes: [
      { offset: 0, properties: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' } },
      { offset: 0.3, properties: { clipPath: 'polygon(2% 2%, 98% 0%, 100% 98%, 0% 100%)' } },
      { offset: 0.6, properties: { clipPath: 'polygon(0% 5%, 100% 0%, 95% 95%, 5% 100%)' } },
      { offset: 1, properties: { clipPath: 'polygon(5% 0%, 95% 5%, 100% 95%, 0% 90%)' } }
    ]
  }
};

// Utility function to get a predefined animation with custom options
export function getPredefinedAnimation(
  name: keyof typeof CYBER_ANIMATIONS, 
  customOptions?: Partial<AnimationConfig>
): AnimationConfig {
  const baseAnimation = { ...CYBER_ANIMATIONS[name] };
  
  if (!customOptions) return baseAnimation;
  
  return {
    ...baseAnimation,
    ...customOptions,
    id: customOptions.id || baseAnimation.id
  };
}
