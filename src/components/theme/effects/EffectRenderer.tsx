
import React, { useEffect, memo } from 'react';
import { ThemeEffect } from '@/theme/types/effects';
import { cn } from '@/lib/utils';

interface EffectRendererProps {
  effect?: ThemeEffect;
  className?: string;
  children: React.ReactNode;
}

export const EffectRenderer = memo(function EffectRenderer({ 
  effect, 
  className,
  children 
}: EffectRendererProps) {
  // No effect, render children as-is
  if (!effect || !effect.enabled) {
    return <div className={className}>{children}</div>;
  }

  // Apply CSS classes and styles based on effect type
  const getEffectStyles = () => {
    switch (effect.type) {
      case 'glitch':
        return {
          className: 'cyber-glitch',
          style: {
            '--effect-color': (effect.color || '#00F0FF') as string,
          } as React.CSSProperties
        };
      
      case 'gradient':
        const gradientEffect = effect as any;
        return {
          className: 'cyber-gradient-flow',
          style: {
            '--effect-color': (gradientEffect.colors?.[0] || '#00F0FF') as string,
          } as React.CSSProperties
        };
      
      case 'cyber':
        const cyberEffect = effect as any;
        return {
          className: 'cyber-glow',
          style: {
            '--effect-color': (cyberEffect.glowColor || '#00F0FF') as string,
          } as React.CSSProperties
        };
      
      case 'pulse':
        const pulseEffect = effect as any;
        return {
          className: 'animate-pulse-slow',
          style: {
            '--effect-color': (pulseEffect.color || '#00F0FF') as string,
          } as React.CSSProperties
        };
      
      case 'particle':
        return {
          className: 'cyber-particles',
          style: {
            '--effect-color': (effect as any).color || '#00F0FF',
          } as React.CSSProperties
        };
      
      case 'morph':
        return {
          className: 'animate-morph-header',
          style: {}
        };
      
      default:
        return { className: '', style: {} };
    }
  };

  const { className: effectClass, style: effectStyle } = getEffectStyles();

  return (
    <div 
      className={cn(className, effectClass)} 
      style={effectStyle}
    >
      {children}
    </div>
  );
});
