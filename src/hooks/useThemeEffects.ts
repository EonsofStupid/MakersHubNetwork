
import { useState, useCallback, useMemo, useRef } from 'react';
import { ThemeEffect, EffectType, GlitchEffect, GradientEffect, CyberEffect, PulseEffect } from '@/theme/types/effects';
import { useDebounce } from './useDebounce';

interface UseThemeEffectsOptions {
  debounceDelay?: number;
  maxActiveEffects?: number;
}

export function useThemeEffects(options: UseThemeEffectsOptions = {}) {
  const { 
    debounceDelay = 100, 
    maxActiveEffects = 10 
  } = options;
  
  // Store active effects in a state object indexed by ID
  const [activeEffects, setActiveEffects] = useState<Record<string, ThemeEffect>>({});
  
  // Debounce effects updates to prevent excessive re-renders
  const debouncedEffects = useDebounce(activeEffects, debounceDelay);
  
  // Keep track of effect timeouts for cleanup
  const effectTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Apply an effect to an element
  const applyEffect = useCallback((id: string, effectType: EffectType, config: Partial<ThemeEffect> = {}) => {
    // Generate a unique effect ID if not provided
    const effectId = `${id}-${effectType}`;
    
    // Check if we've reached max effects limit
    if (Object.keys(activeEffects).length >= maxActiveEffects) {
      console.warn(`Maximum number of active effects (${maxActiveEffects}) reached.`);
      return effectId;
    }
    
    // Create the effect with default properties based on type
    let newEffect: ThemeEffect;
    
    switch (effectType) {
      case 'glitch':
        newEffect = {
          id: effectId,
          type: 'glitch',
          color: config.color || '#00F0FF',
          frequency: (config as Partial<GlitchEffect>)?.frequency || 5,
          amplitude: (config as Partial<GlitchEffect>)?.amplitude || 2,
          enabled: true,
          duration: config.duration || 1000,
        } as GlitchEffect;
        break;
        
      case 'gradient':
        newEffect = {
          id: effectId,
          type: 'gradient',
          colors: (config as Partial<GradientEffect>)?.colors || ['#00F0FF', '#FF2D6E', '#00F0FF'],
          direction: (config as Partial<GradientEffect>)?.direction || 'to-right',
          speed: (config as Partial<GradientEffect>)?.speed || 2,
          enabled: true,
          duration: config.duration || 1000,
        } as GradientEffect;
        break;
        
      case 'cyber':
        newEffect = {
          id: effectId,
          type: 'cyber',
          glowColor: (config as Partial<CyberEffect>)?.glowColor || '#00F0FF',
          textShadow: (config as Partial<CyberEffect>)?.textShadow || true,
          scanLines: (config as Partial<CyberEffect>)?.scanLines || false,
          enabled: true,
          duration: config.duration || 1000,
        } as CyberEffect;
        break;
        
      case 'pulse':
        newEffect = {
          id: effectId,
          type: 'pulse',
          color: (config as Partial<PulseEffect>)?.color || '#00F0FF',
          minOpacity: (config as Partial<PulseEffect>)?.minOpacity || 0.2,
          maxOpacity: (config as Partial<PulseEffect>)?.maxOpacity || 0.8,
          enabled: true,
          duration: config.duration || 1000,
        } as PulseEffect;
        break;
        
      default:
        newEffect = {
          id: effectId,
          type: effectType,
          enabled: true,
          duration: config.duration || 1000,
          ...config
        } as ThemeEffect;
    }
    
    // Add the effect to active effects
    setActiveEffects(prev => ({
      ...prev,
      [effectId]: newEffect
    }));
    
    // Auto-remove effect after duration if not persistent
    if (newEffect.duration && newEffect.duration > 0) {
      // Clear any existing timeout for this effect
      if (effectTimeoutsRef.current[effectId]) {
        clearTimeout(effectTimeoutsRef.current[effectId]);
      }
      
      // Set a new timeout
      effectTimeoutsRef.current[effectId] = setTimeout(() => {
        removeEffect(effectId);
      }, newEffect.duration);
    }
    
    return effectId;
  }, [activeEffects, maxActiveEffects]);
  
  // Remove an effect by ID
  const removeEffect = useCallback((effectId: string) => {
    // Clear any timeout
    if (effectTimeoutsRef.current[effectId]) {
      clearTimeout(effectTimeoutsRef.current[effectId]);
      delete effectTimeoutsRef.current[effectId];
    }
    
    // Remove the effect from state
    setActiveEffects(prev => {
      const newEffects = { ...prev };
      delete newEffects[effectId];
      return newEffects;
    });
  }, []);
  
  // Clear all effects
  const clearAllEffects = useCallback(() => {
    // Clear all timeouts
    Object.values(effectTimeoutsRef.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    effectTimeoutsRef.current = {};
    
    // Clear state
    setActiveEffects({});
  }, []);
  
  // Apply a random effect selected from available types
  const applyRandomEffect = useCallback((id: string, options: { 
    types?: EffectType[], 
    colors?: string[],
    duration?: number
  } = {}) => {
    const { 
      types = ['glitch', 'gradient', 'cyber', 'pulse'],
      colors = ['#00F0FF', '#FF2D6E', '#8B5CF6'],
      duration = 1500
    } = options;
    
    const randomType = types[Math.floor(Math.random() * types.length)] as EffectType;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Configure based on effect type
    let config: Partial<ThemeEffect> = { duration };
    
    switch (randomType) {
      case 'glitch':
        config = {
          ...config,
          color: randomColor,
          frequency: Math.random() * 10 + 5,
          amplitude: Math.random() * 5 + 1,
        } as Partial<GlitchEffect>;
        break;
        
      case 'gradient':
        config = {
          ...config,
          colors: [randomColor, '#FFFFFF', randomColor],
          direction: 'to-right',
          speed: Math.random() * 5 + 1,
        } as Partial<GradientEffect>;
        break;
        
      case 'cyber':
        config = {
          ...config,
          glowColor: randomColor,
          textShadow: true,
        } as Partial<CyberEffect>;
        break;
        
      case 'pulse':
        config = {
          ...config,
          color: randomColor,
          minOpacity: 0.2,
          maxOpacity: 0.8,
        } as Partial<PulseEffect>;
        break;
        
      default:
        // For any other effect types
        config = { 
          ...config,
        } as Partial<ThemeEffect>;
    }
    
    return applyEffect(id, randomType, config);
  }, [applyEffect]);
  
  // Get effect for a specific element
  const getEffectForElement = useCallback((elementId: string) => {
    return Object.values(debouncedEffects).find(
      effect => effect.id.startsWith(elementId)
    );
  }, [debouncedEffects]);
  
  // Return memoized values and functions
  return useMemo(() => ({
    effects: debouncedEffects,
    activeEffectCount: Object.keys(debouncedEffects).length,
    applyEffect,
    removeEffect,
    clearAllEffects,
    applyRandomEffect,
    getEffectForElement
  }), [
    debouncedEffects, 
    applyEffect, 
    removeEffect, 
    clearAllEffects, 
    applyRandomEffect,
    getEffectForElement
  ]);
}
