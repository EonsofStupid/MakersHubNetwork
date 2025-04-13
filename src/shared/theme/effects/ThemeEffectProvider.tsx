
import React from 'react';
import { ThemeEffect, ThemeEffectProviderProps } from '@/shared/types/theme/effects';
import { EffectRenderer } from './EffectRenderer';

/**
 * Provider component to add theme effects to children
 */
export const ThemeEffectProvider: React.FC<ThemeEffectProviderProps> = ({
  children,
  className = '',
  effect = ThemeEffect.NONE
}) => {
  // If no effect specified, return children
  if (effect === ThemeEffect.NONE) {
    return <>{children}</>;
  }

  return (
    <EffectRenderer effect={effect} className={className}>
      {children}
    </EffectRenderer>
  );
};

/**
 * Factory function to create effect-specific providers
 */
export const createEffectProvider = (defaultEffect: ThemeEffect) => {
  return ({ children, className = '' }: Omit<ThemeEffectProviderProps, 'effect'>) => (
    <ThemeEffectProvider effect={defaultEffect} className={className}>
      {children}
    </ThemeEffectProvider>
  );
};

/**
 * Pre-configured effect providers
 */
export const GlitchEffectProvider = createEffectProvider(ThemeEffect.GLITCH);
export const GradientEffectProvider = createEffectProvider(ThemeEffect.GRADIENT);
export const CyberEffectProvider = createEffectProvider(ThemeEffect.CYBER);
export const BlurEffectProvider = createEffectProvider(ThemeEffect.BLUR);
export const GrainEffectProvider = createEffectProvider(ThemeEffect.GRAIN);
export const NoiseEffectProvider = createEffectProvider(ThemeEffect.NOISE);
export const PulseEffectProvider = createEffectProvider(ThemeEffect.PULSE);
export const ParticleEffectProvider = createEffectProvider(ThemeEffect.PARTICLE);

/**
 * Hook to get CSS for current effect
 * @param effect The effect to get CSS for
 * @returns CSS object for the specified effect
 */
export const useEffectStyles = (effect: ThemeEffect): React.CSSProperties => {
  const effectStyles: Record<string, React.CSSProperties> = {
    [ThemeEffect.BLUR]: {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)'
    },
    [ThemeEffect.GLITCH]: {
      position: 'relative',
      overflow: 'hidden'
    },
    [ThemeEffect.GRADIENT]: {
      backgroundImage: 'linear-gradient(135deg, var(--effect-color), var(--effect-secondary))',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite'
    },
    [ThemeEffect.CYBER]: {
      position: 'relative',
      boxShadow: '0 0 10px var(--effect-color)'
    },
    [ThemeEffect.GRAIN]: {
      position: 'relative',
      isolation: 'isolate'
    },
    [ThemeEffect.NOISE]: {
      position: 'relative'
    },
    [ThemeEffect.PULSE]: {
      animation: 'pulse 2s infinite ease-in-out'
    },
    [ThemeEffect.PARTICLE]: {
      position: 'relative',
      overflow: 'hidden'
    },
    [ThemeEffect.NONE]: {}
  };

  return effectStyles[effect] || {};
};
