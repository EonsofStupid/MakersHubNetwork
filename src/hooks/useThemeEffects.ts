
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ThemeEffect, 
  GlitchEffect, 
  GradientEffect, 
  CyberEffect, 
  PulseEffect, 
  ParticleEffect, 
  MorphEffect 
} from '@/theme/types/effects';

export function useThemeEffects(themeId?: string) {
  const [effects, setEffects] = useState<ThemeEffect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEffects() {
      if (!themeId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('theme_effects')
          .select('*')
          .eq('theme_id', themeId);

        if (error) throw error;

        setEffects(data || []);
      } catch (err) {
        console.error('Error fetching theme effects:', err);
        setError(err as Error);
      } finally {
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

  // Return the fetched effects or default effects if none exist
  return {
    effects: effects.length > 0 ? effects : defaultEffects,
    isLoading,
    error
  };
}
