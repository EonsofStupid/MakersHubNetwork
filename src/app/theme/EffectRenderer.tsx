
import React, { useMemo, memo } from 'react';
import { ThemeEffect } from '@/app/theme/types/effects';
import { cn } from '@/shared/utils/cn';

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
            '--effect-color': (effect as any).color || 'var(--site-effect-color, #00F0FF)',
            '--effect-frequency': (effect as any).frequency || '0.5',
            '--effect-amplitude': (effect as any).amplitude || '0.5'
          } as React.CSSProperties
        };
      
      case 'gradient':
        return {
          effectClass: 'cyber-gradient-flow',
          effectStyle: {
            '--effect-color': ((effect as any).colors?.[0] || 'var(--site-effect-color, #00F0FF)'),
            '--effect-secondary': ((effect as any).colors?.[1] || 'var(--site-effect-secondary, #FF2D6E)'),
            '--effect-speed': ((effect as any).speed || 2) + 's'
          } as React.CSSProperties
        };
      
      case 'cyber':
        return {
          effectClass: cn('cyber-glow', (effect as any).scanLines ? 'cyber-scanlines' : ''),
          effectStyle: {
            '--effect-color': ((effect as any).glowColor || 'var(--site-effect-color, #00F0FF)'),
          } as React.CSSProperties
        };
      
      case 'pulse':
        return {
          effectClass: 'animate-pulse-slow',
          effectStyle: {
            '--effect-color': ((effect as any).color || 'var(--site-effect-color, #00F0FF)'),
            '--min-opacity': ((effect as any).minOpacity || 0.2).toString(),
            '--max-opacity': ((effect as any).maxOpacity || 0.8).toString()
          } as React.CSSProperties
        };
      
      case 'particle':
        return {
          effectClass: 'cyber-particles',
          effectStyle: {
            '--effect-color': ((effect as any).color || 'var(--site-effect-color, #00F0FF)'),
            '--particle-count': ((effect as any).count || 5).toString()
          } as React.CSSProperties
        };
      
      case 'morph':
        return {
          effectClass: 'animate-morph-header',
          effectStyle: {
            '--morph-intensity': ((effect as any).intensity || 1).toString(),
            '--morph-speed': ((effect as any).speed || 3) + 's'
          } as React.CSSProperties
        };
      
      default:
        return { effectClass: '', effectStyle: {} };
    }
  }, [effect]);

  return (
    <div 
      className={cn(className, effectClass)} 
      style={effectStyle}
      data-effect-type={effect.type}
    >
      {children}
    </div>
  );
});
