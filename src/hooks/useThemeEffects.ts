
import { useState, useCallback } from 'react';
import { ThemeEffect } from '@/theme/types/effects';

interface EffectOptions {
  types: string[];
  colors?: string[];
  duration?: number;
}

interface ThemeEffectsOptions {
  debounceDelay?: number;
  maxActiveEffects?: number;
}

export function useThemeEffects(options: ThemeEffectsOptions = {}) {
  const { debounceDelay = 200, maxActiveEffects = 3 } = options;
  const [activeEffects, setActiveEffects] = useState<Record<string, ThemeEffect>>({});
  const [debounceTimers, setDebounceTimers] = useState<Record<string, NodeJS.Timeout>>({});

  // Apply a random effect to an element
  const applyRandomEffect = useCallback((elementId: string, options: EffectOptions) => {
    const { types, colors = ['#00F0FF', '#FF2D6E'], duration = 1000 } = options;
    
    // Clear existing timer if there is one
    if (debounceTimers[elementId]) {
      clearTimeout(debounceTimers[elementId]);
    }
    
    // Set a new timer
    const timer = setTimeout(() => {
      // Pick a random effect type
      const effectType = types[Math.floor(Math.random() * types.length)] as any;
      const effectId = `${elementId}-${effectType}`;
      
      // Create effect based on type
      let effect: ThemeEffect;
      
      switch (effectType) {
        case 'glitch':
          effect = {
            id: effectId,
            type: 'glitch',
            enabled: true,
            duration,
            frequency: Math.random() * 0.5 + 0.5,
            amplitude: Math.random() * 0.5 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)]
          };
          break;
        case 'gradient':
          effect = {
            id: effectId,
            type: 'gradient',
            enabled: true,
            duration,
            colors: colors,
            direction: 'to-right',
            speed: Math.random() * 2 + 1
          };
          break;
        case 'cyber':
          effect = {
            id: effectId,
            type: 'cyber',
            enabled: true,
            duration,
            glowColor: colors[Math.floor(Math.random() * colors.length)],
            textShadow: true,
            scanLines: Math.random() > 0.5
          };
          break;
        case 'pulse':
          effect = {
            id: effectId,
            type: 'pulse',
            enabled: true,
            duration,
            color: colors[Math.floor(Math.random() * colors.length)],
            minOpacity: 0.2,
            maxOpacity: 0.8
          };
          break;
        case 'particle':
          effect = {
            id: effectId,
            type: 'particle',
            enabled: true,
            duration,
            color: colors[Math.floor(Math.random() * colors.length)]
          };
          break;
        case 'morph':
          effect = {
            id: effectId,
            type: 'morph',
            enabled: true,
            duration
          };
          break;
        default:
          effect = {
            id: effectId,
            type: 'glitch',
            enabled: true,
            duration
          };
      }
      
      // Update active effects
      setActiveEffects(prev => {
        const newEffects = { ...prev, [effectId]: effect };
        
        // Remove oldest effect if we have too many
        const effectKeys = Object.keys(newEffects);
        if (effectKeys.length > maxActiveEffects) {
          const oldestKey = effectKeys[0];
          const { [oldestKey]: _, ...remainingEffects } = newEffects;
          return remainingEffects;
        }
        
        return newEffects;
      });
      
      // Set a timer to remove the effect after duration
      setTimeout(() => {
        setActiveEffects(prev => {
          const { [effectId]: _, ...rest } = prev;
          return rest;
        });
      }, duration);
      
    }, debounceDelay);
    
    // Store the timer
    setDebounceTimers(prev => ({
      ...prev,
      [elementId]: timer
    }));
  }, [debounceDelay, debounceTimers, maxActiveEffects]);
  
  // Explicitly remove an effect
  const removeEffect = useCallback((effectId: string) => {
    setActiveEffects(prev => {
      const { [effectId]: _, ...rest } = prev;
      return rest;
    });
  }, []);
  
  // Get the effect for an element
  const getEffectForElement = useCallback((elementId: string) => {
    // Check all possible effect types for this element
    const glitchId = `${elementId}-glitch`;
    const gradientId = `${elementId}-gradient`;
    const cyberId = `${elementId}-cyber`;
    const pulseId = `${elementId}-pulse`;
    const particleId = `${elementId}-particle`;
    const morphId = `${elementId}-morph`;
    
    return (
      activeEffects[glitchId] ||
      activeEffects[gradientId] ||
      activeEffects[cyberId] ||
      activeEffects[pulseId] ||
      activeEffects[particleId] ||
      activeEffects[morphId]
    );
  }, [activeEffects]);
  
  return {
    activeEffects,
    applyRandomEffect,
    removeEffect,
    getEffectForElement
  };
}
