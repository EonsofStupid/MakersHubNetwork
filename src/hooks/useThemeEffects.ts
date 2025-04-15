
import { useCallback } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { ThemeEffect, ThemeEffectType } from '@/shared/types/theme.types';

/**
 * Hook for managing theme effects
 */
export const useThemeEffects = () => {
  const effects = useThemeStore((state) => state.effects || []);
  const setEffects = useThemeStore((state) => state.setEffects);
  
  // Check if an effect is active
  const hasEffect = useCallback((effectType: ThemeEffectType): boolean => {
    return effects.some(effect => effect.type === effectType);
  }, [effects]);
  
  // Add a theme effect
  const addEffect = useCallback((effect: ThemeEffect) => {
    if (!effects.some(e => e.type === effect.type)) {
      setEffects([...effects, effect]);
    }
  }, [effects, setEffects]);
  
  // Remove a theme effect
  const removeEffect = useCallback((effectType: ThemeEffectType) => {
    setEffects(effects.filter(e => e.type !== effectType));
  }, [effects, setEffects]);
  
  // Toggle a theme effect
  const toggleEffect = useCallback((effect: ThemeEffect) => {
    if (effects.some(e => e.type === effect.type)) {
      removeEffect(effect.type);
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
