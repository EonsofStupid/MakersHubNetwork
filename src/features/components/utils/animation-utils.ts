import { AnimationConfig, AnimationType, AnimationDirection, AnimationTiming } from '../types';

export const defaultAnimationConfig: AnimationConfig = {
  type: 'fade',
  direction: 'in',
  duration: 300,
  timing: 'ease',
};

export const getAnimationVariants = (config: AnimationConfig) => {
  const { type, direction, duration, delay = 0, timing = 'ease' } = config;

  const baseTransition = {
    duration: duration ? duration / 1000 : 0.3,
    delay: delay / 1000,
    ease: timing,
  };

  switch (type) {
    case 'fade':
      return {
        initial: { opacity: direction === 'in' ? 0 : 1 },
        animate: { opacity: direction === 'in' ? 1 : 0 },
        exit: { opacity: 0 },
        transition: baseTransition,
      };

    case 'slide':
      return {
        initial: { x: direction === 'in' ? -20 : 0, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: direction === 'in' ? 20 : -20, opacity: 0 },
        transition: baseTransition,
      };

    case 'scale':
      return {
        initial: { scale: direction === 'in' ? 0.95 : 1, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: direction === 'in' ? 1.05 : 0.95, opacity: 0 },
        transition: baseTransition,
      };

    default:
      return config.custom || {};
  }
};

export const combineAnimations = (
  animations: AnimationConfig[],
  sequential = false
): AnimationConfig => {
  if (animations.length === 0) return defaultAnimationConfig;
  if (animations.length === 1) return animations[0];

  let totalDuration = 0;
  let maxDuration = 0;

  animations.forEach((animation) => {
    const duration = animation.duration || defaultAnimationConfig.duration;
    totalDuration += duration + (animation.delay || 0);
    maxDuration = Math.max(maxDuration, duration + (animation.delay || 0));
  });

  return {
    type: 'custom',
    duration: sequential ? totalDuration : maxDuration,
    custom: animations.reduce((acc, animation, index) => {
      const delay = sequential
        ? animations
            .slice(0, index)
            .reduce((sum, prev) => sum + (prev.duration || 0) + (prev.delay || 0), 0)
        : animation.delay || 0;

      return {
        ...acc,
        [`animation${index}`]: getAnimationVariants({
          ...animation,
          delay,
        }),
      };
    }, {}),
  };
};

export const getTimingFunction = (timing: AnimationTiming): string => {
  switch (timing) {
    case 'linear':
      return 'cubic-bezier(0, 0, 1, 1)';
    case 'ease':
      return 'cubic-bezier(0.25, 0.1, 0.25, 1)';
    case 'ease-in':
      return 'cubic-bezier(0.42, 0, 1, 1)';
    case 'ease-out':
      return 'cubic-bezier(0, 0, 0.58, 1)';
    case 'ease-in-out':
      return 'cubic-bezier(0.42, 0, 0.58, 1)';
    default:
      return 'cubic-bezier(0.25, 0.1, 0.25, 1)';
  }
}; 