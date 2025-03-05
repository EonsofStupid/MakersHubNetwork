
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export type AnimationKeyframe = {
  offset: number; // 0 to 1
  properties: Record<string, any>;
};

export type AnimationConfig = {
  id: string;
  duration: number;
  delay?: number;
  iterations?: number;
  iterationString?: 'infinite'; // Added separate property for string 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  easing?: string;
  keyframes: AnimationKeyframe[];
  onFinish?: () => void;
};

export function useAnimationSystem() {
  const [animations, setAnimations] = useState<Record<string, AnimationConfig>>({});
  const animationRefs = useRef<Record<string, Animation>>({});
  
  // Clean up animations when component unmounts
  useEffect(() => {
    return () => {
      Object.values(animationRefs.current).forEach(animation => {
        if (animation) {
          animation.cancel();
        }
      });
    };
  }, []);
  
  // Register a new animation
  const registerAnimation = useCallback((config: AnimationConfig) => {
    setAnimations(prev => ({
      ...prev,
      [config.id]: config
    }));
  }, []);
  
  // Play an animation on an element
  const playAnimation = useCallback((elementId: string, animationId: string) => {
    const element = document.getElementById(elementId);
    const config = animations[animationId];
    
    if (!element || !config) {
      console.warn(`Cannot play animation: ${!element ? 'Element not found' : 'Animation config not found'}`);
      return;
    }
    
    // Convert our keyframe format to Web Animations API format
    const keyframes = config.keyframes.map(keyframe => ({
      offset: keyframe.offset,
      ...keyframe.properties
    }));
    
    // Create animation options
    const options: KeyframeAnimationOptions = {
      duration: config.duration,
      delay: config.delay || 0,
      iterations: config.iterationString === 'infinite' ? Infinity : (config.iterations || 1),
      direction: config.direction || 'normal',
      easing: config.easing || 'ease',
      fill: 'forwards'
    };
    
    // Cancel any existing animation on this element
    if (animationRefs.current[elementId]) {
      animationRefs.current[elementId].cancel();
    }
    
    // Start the animation
    try {
      const animation = element.animate(keyframes, options);
      
      // Store reference to cancel later if needed
      animationRefs.current[elementId] = animation;
      
      // Handle finish event
      if (config.onFinish) {
        animation.onfinish = config.onFinish;
      }
      
      return animation;
    } catch (error) {
      console.error('Error playing animation:', error);
      return null;
    }
  }, [animations]);
  
  // Stop an animation
  const stopAnimation = useCallback((elementId: string) => {
    const animation = animationRefs.current[elementId];
    if (animation) {
      animation.cancel();
      delete animationRefs.current[elementId];
    }
  }, []);
  
  // Pause an animation
  const pauseAnimation = useCallback((elementId: string) => {
    const animation = animationRefs.current[elementId];
    if (animation) {
      animation.pause();
    }
  }, []);
  
  // Resume an animation
  const resumeAnimation = useCallback((elementId: string) => {
    const animation = animationRefs.current[elementId];
    if (animation) {
      animation.play();
    }
  }, []);
  
  // Remove an animation from registry
  const unregisterAnimation = useCallback((animationId: string) => {
    setAnimations(prev => {
      const newAnimations = { ...prev };
      delete newAnimations[animationId];
      return newAnimations;
    });
  }, []);
  
  return useMemo(() => ({
    animations,
    registerAnimation,
    playAnimation,
    stopAnimation,
    pauseAnimation,
    resumeAnimation,
    unregisterAnimation
  }), [
    animations,
    registerAnimation,
    playAnimation,
    stopAnimation,
    pauseAnimation,
    resumeAnimation,
    unregisterAnimation
  ]);
}
