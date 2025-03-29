
import { useCallback, useRef } from 'react';
import { useAtom } from 'jotai';
import { heroHoveredButtonAtom } from '../atoms';
import { useThemeEffects } from '@/hooks/useThemeEffects';
import { publishFeatureEvent } from '@/features/shared/bridge/communication';

export function useFeatureEffect() {
  const [hoveredButton, setHoveredButton] = useAtom(heroHoveredButtonAtom);
  const { 
    applyRandomEffect, 
    removeEffect, 
    getEffectForElement 
  } = useThemeEffects({
    debounceDelay: 100, 
    maxActiveEffects: 5
  });
  
  // Store timeouts for cleanup
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Function to apply random effect to a CTA on hover
  const handleHover = useCallback((id: string) => {
    setHoveredButton(id);
    
    // Apply visual effect
    const effectId = applyRandomEffect(id, {
      types: ['glitch', 'gradient', 'cyber', 'pulse'],
      colors: ['#00F0FF', '#FF2D6E', '#8B5CF6'],
      duration: 2000
    });
    
    // Publish event to admin
    publishFeatureEvent('landing', 'element-hovered', {
      elementId: id,
      effectId,
      timestamp: Date.now()
    });
    
  }, [applyRandomEffect, setHoveredButton]);

  // Clear effects when mouse leaves
  const handleLeave = useCallback((id: string) => {
    setHoveredButton(null);
    
    // Clear with slight delay for smoother transition
    const timeout = setTimeout(() => {
      removeEffect(`${id}-glitch`);
      removeEffect(`${id}-gradient`);
      removeEffect(`${id}-cyber`);
      removeEffect(`${id}-pulse`);
      
      // Publish event to admin
      publishFeatureEvent('landing', 'element-unhovered', {
        elementId: id,
        timestamp: Date.now()
      });
    }, 100);
    
    // Store timeout and clean up any existing one
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
    }
    timeoutsRef.current[id] = timeout;
  }, [removeEffect, setHoveredButton]);

  // Get effect for a specific element
  const getEffectFor = useCallback((id: string) => {
    return getEffectForElement(id);
  }, [getEffectForElement]);

  return {
    hoveredButton,
    handleHover,
    handleLeave,
    getEffectFor
  };
}
