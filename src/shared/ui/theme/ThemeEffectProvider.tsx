import React from 'react';
import { ThemeEffect, ThemeEffectType } from '@/shared/types';

// Define the ThemeEffectProps interface
interface ThemeEffectProps {
  effect: ThemeEffect;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
}

// Define ThemeEffectProviderProps interface
interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  effect?: ThemeEffect;
}

/**
 * Default effect when none is provided
 */
const DEFAULT_EFFECT: ThemeEffect = {
  type: ThemeEffectType.NONE,
  enabled: false,
  intensity: 1
};

/**
 * EffectRenderer component for rendering different theme effects
 */
const EffectRenderer: React.FC<ThemeEffectProps> = ({
  effect,
  children,
  className = '',
  style = {},
  intensity = 1
}) => {
  // Apply appropriate effect based on type
  switch (effect.type) {
    case ThemeEffectType.BLUR:
      return (
        <div 
          className={`${className} backdrop-blur-sm`} 
          style={{ 
            ...style,
            backdropFilter: `blur(${intensity * 3}px)`
          }}
        >
          {children}
        </div>
      );
      
    case ThemeEffectType.GRAIN:
      return (
        <div 
          className={`${className} relative before:absolute before:inset-0 before:opacity-30 before:z-[-1]`}
          style={style}
        >
          {children}
        </div>
      );
      
    case ThemeEffectType.GLOW:
      return (
        <div 
          className={`${className} relative shadow-lg`}
          style={{
            ...style,
            boxShadow: `0 0 ${intensity * 10}px ${intensity * 5}px ${effect.color || 'rgba(0, 100, 255, 0.3)'}`
          }}
        >
          {children}
        </div>
      );
      
    // Add more effects as needed
      
    default:
      // Return children without any special effect
      return <div className={className} style={style}>{children}</div>;
  }
};

/**
 * ThemeEffectProvider component
 * Wraps content with theme effects
 */
export const ThemeEffectProvider: React.FC<ThemeEffectProviderProps> = ({
  children,
  className = '',
  effect
}) => {
  // If no effect or effect is disabled, just render the children
  if (!effect || !effect.enabled) {
    return <>{children}</>;
  }

  const effectConfig = effect || DEFAULT_EFFECT;
  const effectStyle: Record<string, any> = {};
  
  // Add any effect-specific styles
  if (effectConfig.color) {
    effectStyle.color = effectConfig.color;
  }

  return (
    <EffectRenderer 
      effect={effectConfig}
      className={className}
      style={effectStyle}
      intensity={effectConfig.intensity}
    >
      {children}
    </EffectRenderer>
  );
};

export default ThemeEffectProvider;
