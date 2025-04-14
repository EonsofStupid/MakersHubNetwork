
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ThemeEffectType, ThemeEffect } from '@/shared/types/theme.types';

/**
 * Hook for managing theme effects
 */
export function useThemeEffects() {
  const [effects, setEffects] = useState<Record<string, ThemeEffect>>({});
  
  // Add a new effect
  const addEffect = useCallback((elementId: string, effect: Partial<ThemeEffect>) => {
    const id = `${elementId}-${Date.now()}`;
    const newEffect: ThemeEffect = {
      id,
      type: effect.type || ThemeEffectType.NONE,
      enabled: effect.enabled !== undefined ? effect.enabled : true,
      intensity: effect.intensity || 1,
      selector: effect.selector,
      config: effect.config,
      color: effect.color
    };
    
    setEffects(prev => ({
      ...prev,
      [id]: newEffect
    }));
    
    return id;
  }, []);
  
  // Remove an effect by ID
  const removeEffect = useCallback((effectId: string) => {
    setEffects(prev => {
      const { [effectId]: _, ...rest } = prev;
      return rest;
    });
  }, []);
  
  // Get effects as an array
  const getEffects = useCallback(() => {
    return Object.values(effects);
  }, [effects]);
  
  // Get a specific effect by ID
  const getEffect = useCallback((effectId: string) => {
    return effects[effectId];
  }, [effects]);
  
  // Update an existing effect
  const updateEffect = useCallback((effectId: string, updates: Partial<ThemeEffect>) => {
    setEffects(prev => {
      if (!prev[effectId]) return prev;
      
      return {
        ...prev,
        [effectId]: {
          ...prev[effectId],
          ...updates
        }
      };
    });
  }, []);
  
  return {
    addEffect,
    removeEffect,
    getEffects,
    getEffect,
    updateEffect,
    effects
  };
}
