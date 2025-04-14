
import { useState, useEffect, useCallback } from 'react';
import { ThemeEffect, ThemeEffectType } from '@/shared/types/shared.types';

/**
 * Hook to manage theme effects
 */
export function useThemeEffects() {
  const [effects, setEffects] = useState<ThemeEffect[]>([]);
  
  /**
   * Add a new effect
   */
  const addEffect = useCallback((effect: ThemeEffect) => {
    setEffects(prevEffects => [...prevEffects, effect]);
    return effect.id || Math.random().toString(36).substring(7);
  }, []);
  
  /**
   * Remove an effect by id
   */
  const removeEffect = useCallback((effectId: string) => {
    setEffects(prevEffects => prevEffects.filter(e => e.id !== effectId));
  }, []);
  
  /**
   * Update an existing effect
   */
  const updateEffect = useCallback((effectId: string, updates: Partial<ThemeEffect>) => {
    setEffects(prevEffects => 
      prevEffects.map(e => e.id === effectId ? { ...e, ...updates } : e)
    );
  }, []);
  
  /**
   * Toggle an effect's enabled state
   */
  const toggleEffect = useCallback((effectId: string) => {
    setEffects(prevEffects => 
      prevEffects.map(e => e.id === effectId ? { ...e, enabled: !e.enabled } : e)
    );
  }, []);
  
  /**
   * Get all effects of a specific type
   */
  const getEffectsByType = useCallback((type: ThemeEffectType) => {
    return effects.filter(e => e.type === type);
  }, [effects]);
  
  /**
   * Clear all effects
   */
  const clearEffects = useCallback(() => {
    setEffects([]);
  }, []);
  
  // Clean up effects on unmount
  useEffect(() => {
    return () => {
      // Any cleanup logic for effects if needed
    };
  }, []);
  
  return {
    effects,
    addEffect,
    removeEffect,
    updateEffect,
    toggleEffect,
    getEffectsByType,
    clearEffects
  };
}
