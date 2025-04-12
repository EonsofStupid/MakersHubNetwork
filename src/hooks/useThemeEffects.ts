
import { useCallback } from 'react';
import { useThemeEffect } from '@/shared/theme/effects/ThemeEffectProvider';
import { ThemeEffect, GlitchEffect, CyberEffect, GradientEffect, PulseEffect } from '@/theme/types/effects';

interface EffectOptions {
  types?: string[];
  colors?: string[];
  duration?: number;
}

export function useThemeEffects() {
  const { addEffect, removeEffect } = useThemeEffect();

  const applyEffect = useCallback((
    elementId: string, 
    effect: ThemeEffect
  ) => {
    // Generate a unique ID for this effect
    const effectId = `${elementId}-${effect.type}`;
    
    // Add effect with its ID
    addEffect(elementId, {
      ...effect,
      id: effectId,
      enabled: true
    });
    
    // If duration is specified, remove effect after duration
    if ('duration' in effect && effect.duration) {
      setTimeout(() => {
        removeEffect(effectId);
      }, effect.duration);
    }
    
    // Return a cleanup function
    return () => removeEffect(effectId);
  }, [addEffect, removeEffect]);

  const applyRandomEffect = useCallback((
    elementId: string, 
    options: EffectOptions = {}
  ) => {
    // Default options
    const { 
      types = ['glitch', 'cyber', 'gradient', 'pulse'],
      colors = ['#00F0FF', '#FF2D6E', '#8B5CF6'],
      duration = 2000
    } = options;

    // Pick a random effect type from available types
    const type = types[Math.floor(Math.random() * types.length)];
    // Pick a random color
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Create effect based on type
    let effect: ThemeEffect;
    switch (type) {
      case 'glitch':
        effect = {
          id: `${elementId}-glitch`,
          type: 'glitch',
          enabled: true,
          color,
          frequency: Math.random() * 0.5 + 0.3,
          amplitude: Math.random() * 0.5 + 0.3,
          duration
        } as GlitchEffect;
        break;

      case 'cyber':
        effect = {
          id: `${elementId}-cyber`,
          type: 'cyber',
          enabled: true,
          glowColor: color,
          textShadow: true,
          scanLines: Math.random() > 0.7,
          duration
        } as CyberEffect;
        break;

      case 'gradient':
        effect = {
          id: `${elementId}-gradient`,
          type: 'gradient',
          enabled: true,
          colors: [color, colors[(colors.indexOf(color) + 1) % colors.length]],
          speed: Math.random() * 3 + 1,
          duration
        } as GradientEffect;
        break;

      case 'pulse':
        effect = {
          id: `${elementId}-pulse`,
          type: 'pulse',
          enabled: true,
          color,
          minOpacity: 0.2,
          maxOpacity: 0.8,
          duration
        } as PulseEffect;
        break;

      default:
        effect = {
          id: `${elementId}-default`,
          type: 'default',
          enabled: true,
          duration
        };
    }

    return applyEffect(elementId, effect);
  }, [applyEffect]);

  return {
    applyEffect,
    applyRandomEffect,
    removeEffect
  };
}
