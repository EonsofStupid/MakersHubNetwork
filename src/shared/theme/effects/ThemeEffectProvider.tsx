
import React, { useMemo } from 'react';
import { cn } from '@/shared/utils/cn';
import { ThemeEffectType } from '@/shared/types/shared.types';
import { ThemeEffect } from '@/shared/types/theme/effects.types';

interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  effect?: ThemeEffect;
}

const ThemeEffectProvider: React.FC<ThemeEffectProviderProps> = ({
  children,
  className,
  effect
}) => {
  // Skip rendering effects if no effect or disabled
  if (!effect || !effect.enabled) {
    return <div className={className}>{children}</div>;
  }

  // Generate CSS class based on effect type
  const effectClass = useMemo(() => {
    const type = effect.type as ThemeEffectType;
    
    const baseClasses = cn(
      'theme-effect-container',
      `effect-${type}`,
      className
    );
    
    switch (type) {
      case ThemeEffectType.GRADIENT:
        return cn(baseClasses, 'gradient-effect');
      case ThemeEffectType.GLOW:
        return cn(baseClasses, 'glow-effect');
      case ThemeEffectType.BLUR:
      case ThemeEffectType.MORPH: // Support legacy name
        return cn(baseClasses, 'blur-effect');
      case ThemeEffectType.NOISE:
      case ThemeEffectType.GLITCH: // Support legacy name
        return cn(baseClasses, 'noise-effect');
      case ThemeEffectType.NEON:
      case ThemeEffectType.CYBER: // Support legacy name
        return cn(baseClasses, 'neon-effect');
      case ThemeEffectType.PULSE:
        return cn(baseClasses, 'pulse-effect');
      case ThemeEffectType.PARTICLE:
        return cn(baseClasses, 'particle-effect');
      case ThemeEffectType.SHADOW:
        return cn(baseClasses, 'shadow-effect');
      default:
        return baseClasses;
    }
  }, [effect, className]);

  // Generate CSS variables for the effect
  const effectStyle: React.CSSProperties = {};
  
  switch (effect.type) {
    case ThemeEffectType.GRADIENT:
      effectStyle['--effect-colors'] = Array.isArray(effect.colors) ? effect.colors.join(', ') : '';
      effectStyle['--effect-speed'] = effect.speed ? `${effect.speed}s` : '5s';
      break;
      
    case ThemeEffectType.GLOW:
      effectStyle['--glow-color'] = effect.color || '';
      effectStyle['--glow-intensity'] = effect.intensity || 1;
      break;
      
    case ThemeEffectType.BLUR:
    case ThemeEffectType.MORPH:
      effectStyle['--blur-intensity'] = `${effect.intensity || 2}px`;
      effectStyle['--blur-speed'] = `${effect.speed || 5}s`;
      break;
      
    case ThemeEffectType.NOISE:
    case ThemeEffectType.GLITCH:
      effectStyle['--noise-opacity'] = effect.intensity || 0.05;
      effectStyle['--noise-frequency'] = effect.frequency || '0.5';
      break;
      
    case ThemeEffectType.NEON:
    case ThemeEffectType.CYBER:
      effectStyle['--neon-color'] = effect.glowColor || '#00f8ff';
      break;
      
    case ThemeEffectType.PULSE:
      effectStyle['--pulse-color'] = effect.color || '';
      effectStyle['--pulse-min-opacity'] = effect.minOpacity || 0;
      effectStyle['--pulse-max-opacity'] = effect.maxOpacity || 0.1;
      break;
      
    case ThemeEffectType.PARTICLE:
      effectStyle['--particle-color'] = effect.color || '';
      effectStyle['--particle-count'] = effect.count || 50;
      break;
  }

  return (
    <div className={effectClass} style={effectStyle}>
      {children}
    </div>
  );
};

export default ThemeEffectProvider;

// Helper hook to use the theme effect
export const useThemeEffect = (effect?: ThemeEffect) => {
  return useMemo(() => {
    if (!effect) return { className: '', style: {} };
    
    // Generate the styles based on the effect
    // This logic is similar to what's in the component
    const style: React.CSSProperties = {};
    
    // Set CSS variables based on effect type
    // ... similar to the switch case above
    
    return { 
      className: `effect-${effect.type}`, 
      style 
    };
  }, [effect]);
};
