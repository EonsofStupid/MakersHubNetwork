
import { useCallback } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { ThemeEffectType } from '@/shared/types/shared.types';

/**
 * Hook for managing theme effects
 */
export const useThemeEffects = () => {
  // Access theme store
  const effects = useThemeStore(state => state.effects || []);
  const setEffects = useThemeStore(state => state.setEffects);
  
  // Check if an effect is active
  const hasEffect = useCallback((effect: string): boolean => {
    return effects.includes(effect);
  }, [effects]);
  
  // Add a theme effect
  const addEffect = useCallback((effect: string) => {
    if (!effects.includes(effect)) {
      setEffects([...effects, effect]);
    }
  }, [effects, setEffects]);
  
  // Remove a theme effect
  const removeEffect = useCallback((effect: string) => {
    setEffects(effects.filter(e => e !== effect));
  }, [effects, setEffects]);
  
  // Toggle a theme effect
  const toggleEffect = useCallback((effect: string) => {
    if (effects.includes(effect)) {
      removeEffect(effect);
    } else {
      addEffect(effect);
    }
  }, [effects, addEffect, removeEffect]);
  
  // Clear all effects
  const clearEffects = useCallback(() => {
    setEffects([]);
  }, [setEffects]);
  
  return {
    effects,
    hasEffect,
    addEffect,
    removeEffect,
    toggleEffect,
    clearEffects,
    ThemeEffectType
  };
};
