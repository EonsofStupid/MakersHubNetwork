
import React from 'react';
import { ThemeEffectType, ThemeEffect } from '@/shared/types/theme.types';
import { cn } from '@/shared/utils/cn';

interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  effect?: ThemeEffect;
}

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

  // Apply appropriate effect based on type
  switch (effect.type) {
    case ThemeEffectType.BLUR:
      return (
        <div 
          className={`${className} backdrop-blur-sm`} 
          style={{ 
            backdropFilter: `blur(${effect.intensity * 3}px)`
          }}
        >
          {children}
        </div>
      );
      
    case ThemeEffectType.GRAIN:
      return (
        <div 
          className={`${className} relative before:absolute before:inset-0 before:opacity-30 before:z-[-1]`}
        >
          {children}
        </div>
      );
      
    case ThemeEffectType.GLOW:
      return (
        <div 
          className={`${className} relative shadow-lg`}
          style={{
            boxShadow: `0 0 ${effect.intensity * 10}px ${effect.intensity * 5}px ${effect.color || 'rgba(0, 100, 255, 0.3)'}`
          }}
        >
          {children}
        </div>
      );
      
    case ThemeEffectType.CYBER:
      return (
        <div 
          className={cn(
            className,
            "relative cyber-container before:absolute before:inset-0 before:z-10 before:pointer-events-none before:opacity-5"
          )}
        >
          {children}
        </div>
      );
      
    default:
      // Return children without any special effect
      return <div className={className}>{children}</div>;
  }
};

export default ThemeEffectProvider;
