
import React, { useMemo, memo } from 'react';
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

  // Compute effect styles and classes
  const { effectClass, effectStyle } = useMemo(() => {
    if (!effect) return { effectClass: '', effectStyle: {} };
    
    switch (effect.type) {
      case 'glitch':
        return {
          effectClass: 'cyber-glitch',
          effectStyle: {
            '--effect-color': (effect as any).color || '#00F0FF',
          } as React.CSSProperties
        };
      
      case 'gradient':
        return {
          effectClass: 'cyber-gradient-flow',
          effectStyle: {
            '--effect-color': ((effect as any).colors?.[0] || '#00F0FF'),
          } as React.CSSProperties
        };
      
      case 'cyber':
        return {
          effectClass: 'cyber-glow',
          effectStyle: {
            '--effect-color': ((effect as any).glowColor || '#00F0FF'),
          } as React.CSSProperties
        };
      
      case 'pulse':
        return {
          effectClass: 'animate-pulse-slow',
          effectStyle: {
            '--effect-color': ((effect as any).color || '#00F0FF'),
          } as React.CSSProperties
        };
      
      case 'particle':
        return {
          effectClass: 'cyber-particles',
          effectStyle: {
            '--effect-color': ((effect as any).color || '#00F0FF'),
          } as React.CSSProperties
        };
      
      case 'morph':
        return {
          effectClass: 'animate-morph-header',
          effectStyle: {}
        };
      
      default:
        return { effectClass: '', effectStyle: {} };
    }
  }, [effect]);

  return (
    <div 
      className={cn(className, effectClass)} 
      style={effectStyle}
    >
      {children}
    </div>
  );
});
