import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ThemeEffect, 
  GlitchEffect, 
  GradientEffect, 
  CyberEffect, 
  PulseEffect, 
  ParticleEffect, 
  MorphEffect,
  EffectType
} from '@/theme/types/effects';

interface UseThemeEffectsOptions {
  debounceDelay?: number;
  maxActiveEffects?: number;
}

interface UseThemeEffectsReturn {
  effects: ThemeEffect[];
  isLoading: boolean;
  error: Error | null;
  applyRandomEffect: (elementId: string, options?: ApplyEffectOptions) => void;
  removeEffect: (elementId: string) => void;
  getEffectForElement: (elementId: string) => ThemeEffect | undefined;
}

interface ApplyEffectOptions {
  types?: EffectType[];
  colors?: string[];
  duration?: number;
}

export function useThemeEffects(themeId?: string, options: UseThemeEffectsOptions = {}): UseThemeEffectsReturn {
  const [effects, setEffects] = useState<ThemeEffect[]>([]);
  const [activeEffects, setActiveEffects] = useState<Record<string, ThemeEffect>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { debounceDelay = 300, maxActiveEffects = 10 } = options;

  useEffect(() => {
    async function fetchEffects() {
      if (!themeId) {
        setIsLoading(false);
        return;
      }

      try {
        // For now, we'll just use defaults since this table doesn't exist yet
        // When the theme_effects table is created, we can uncomment this code
        /*
        const { data, error } = await supabase
          .from('theme_effects')
          .select('*')
          .eq('theme_id', themeId);

        if (error) throw error;

        setEffects(data as ThemeEffect[] || []);
        */
        
        // For now just set the isLoading to false
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching theme effects:', err);
        setError(err as Error);
        setIsLoading(false);
      } 
    }

    fetchEffects();
  }, [themeId]);

  // Create default effects if none exist
  const defaultEffects: ThemeEffect[] = [
    {
      id: 'glitch-default',
      type: 'glitch',
      enabled: true,
      duration: 2000,
      frequency: 0.5,
      amplitude: 1.5,
      color: '#00F0FF'
    } as GlitchEffect,
    {
      id: 'gradient-default',
      type: 'gradient',
      enabled: true,
      duration: 3000,
      colors: ['#00F0FF', '#FF2D6E', '#8B5CF6'],
      direction: 'to-right',
      speed: 1.5
    } as GradientEffect,
    {
      id: 'cyber-default',
      type: 'cyber',
      enabled: true,
      duration: 1500,
      glowColor: '#00F0FF',
      textShadow: true,
      scanLines: true
    } as CyberEffect,
    {
      id: 'pulse-default',
      type: 'pulse',
      enabled: true,
      duration: 2000,
      color: '#00F0FF',
      minOpacity: 0.2,
      maxOpacity: 0.8
    } as PulseEffect,
    {
      id: 'particle-default',
      type: 'particle',
      enabled: true,
      duration: 5000,
      color: '#00F0FF',
      count: 50,
      speed: 1
    } as ParticleEffect,
    {
      id: 'morph-default',
      type: 'morph',
      enabled: true,
      duration: 2500,
      intensity: 2,
      speed: 1
    } as MorphEffect
  ];

  // Generate a random effect for a specific element
  const applyRandomEffect = useCallback((
    elementId: string, 
    options: ApplyEffectOptions = {}
  ) => {
    const { 
      types = ['glitch', 'gradient', 'cyber', 'pulse', 'particle', 'morph'] as EffectType[],
      colors = ['#00F0FF', '#FF2D6E', '#8B5CF6'],
      duration = 2000 
    } = options;
    
    // Choose a random effect type
    const effectType = types[Math.floor(Math.random() * types.length)];
    
    // Base effect properties
    const baseEffect: ThemeEffect = {
      id: `${elementId}-${effectType}-${Date.now()}`,
      type: effectType,
      enabled: true,
      duration
    };
    
    // Add type-specific properties
    let effect: ThemeEffect;
    switch (effectType) {
      case 'glitch':
        effect = {
          ...baseEffect,
          frequency: Math.random() * 0.5 + 0.5,
          amplitude: Math.random() * 1 + 0.5,
          color: colors[0]
        } as GlitchEffect;
        break;
      
      case 'gradient':
        effect = {
          ...baseEffect,
          colors: colors,
          direction: 'to-right',
          speed: Math.random() * 2 + 1
        } as GradientEffect;
        break;
      
      case 'cyber':
        effect = {
          ...baseEffect,
          glowColor: colors[0],
          textShadow: Math.random() > 0.5,
          scanLines: Math.random() > 0.5
        } as CyberEffect;
        break;
      
      case 'pulse':
        effect = {
          ...baseEffect,
          color: colors[0],
          minOpacity: 0.2,
          maxOpacity: 0.8
        } as PulseEffect;
        break;
      
      case 'particle':
        effect = {
          ...baseEffect,
          color: colors[0],
          count: Math.floor(Math.random() * 45) + 5,
          speed: Math.random() * 1.5 + 0.5
        } as ParticleEffect;
        break;
      
      case 'morph':
        effect = {
          ...baseEffect,
          intensity: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 1.5 + 0.5
        } as MorphEffect;
        break;
      
      default:
        effect = baseEffect;
    }
    
    // Add the effect to active effects
    setActiveEffects(prev => {
      const newActiveEffects = { ...prev, [effect.id]: effect };
      
      // If we have too many active effects, remove the oldest one
      const effectIds = Object.keys(newActiveEffects);
      if (effectIds.length > maxActiveEffects) {
        const oldestId = effectIds[0];
        const { [oldestId]: _, ...rest } = newActiveEffects;
        return rest;
      }
      
      return newActiveEffects;
    });
    
    // Automatically remove the effect after duration
    setTimeout(() => {
      removeEffect(effect.id);
    }, effect.duration || 2000);
    
    return effect;
  }, [maxActiveEffects]);

  // Remove an effect by ID
  const removeEffect = useCallback((effectId: string) => {
    setActiveEffects(prev => {
      // If the effectId is an element ID, remove all effects for that element
      if (effectId.indexOf('-') === -1) {
        const newEffects = { ...prev };
        Object.keys(newEffects).forEach(id => {
          if (id.startsWith(`${effectId}-`)) {
            delete newEffects[id];
          }
        });
        return newEffects;
      }
      
      // Otherwise remove the specific effect
      const { [effectId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Get an effect for a specific element
  const getEffectForElement = useCallback((elementId: string): ThemeEffect | undefined => {
    // Look through active effects to find ones for this element
    const elementEffects = Object.values(activeEffects).filter(effect => 
      effect.id.startsWith(`${elementId}-`)
    );
    
    // Return the most recent effect
    return elementEffects.length > 0 
      ? elementEffects[elementEffects.length - 1] 
      : undefined;
  }, [activeEffects]);

  // Combine default and active effects
  const allEffects = [...defaultEffects, ...Object.values(activeEffects)];

  return {
    effects: allEffects,
    isLoading,
    error,
    applyRandomEffect,
    removeEffect,
    getEffectForElement
  };
}
