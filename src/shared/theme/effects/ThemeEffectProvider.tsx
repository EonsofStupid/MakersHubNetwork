
import React from 'react';
import { ThemeEffectType } from '@/shared/types/shared.types';
import { ThemeEffect } from '@/shared/types/theme/effects.types';

interface ThemeEffectProviderProps {
  children: React.ReactNode;
  effect?: ThemeEffect | null;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Component that provides theme effects to its children
 */
export const ThemeEffectProvider: React.FC<ThemeEffectProviderProps> = ({
  children,
  effect,
  className = '',
  style = {}
}) => {
  // No effect or disabled effect - render children directly
  if (!effect || !effect.enabled || effect.type === ThemeEffectType.NONE) {
    return <>{children}</>;
  }

  // Apply the appropriate effect
  switch (effect.type) {
    case ThemeEffectType.BLUR:
    case ThemeEffectType.MORPH:
      const blurIntensity = effect.intensity || 1;
      return (
        <div
          className={`backdrop-blur ${className}`}
          style={{
            backdropFilter: `blur(${blurIntensity * 3}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity * 3}px)`,
            ...style
          }}
        >
          {children}
        </div>
      );

    case ThemeEffectType.NOISE:
    case ThemeEffectType.GLITCH:
      const glitchIntensity = effect.intensity || 1;
      const glitchColor = effect.color || 'rgba(255, 0, 255, 0.3)';
      return (
        <div
          className={`relative glitch-container ${className}`}
          style={{
            ...style,
            isolation: 'isolate',
          }}
          data-effect="noise"
          data-intensity={glitchIntensity}
        >
          {children}
          <div 
            className="glitch-overlay absolute inset-0 pointer-events-none mix-blend-overlay z-10"
            style={{ 
              opacity: 0.05 * glitchIntensity, 
              backgroundColor: glitchColor
            }} 
          />
        </div>
      );

    case ThemeEffectType.GRADIENT:
      const colors = (effect.colors as string[]) || [
        'rgba(131,58,180,1)', 
        'rgba(253,29,29,1)', 
        'rgba(252,176,69,1)'
      ];
      const speed = effect.speed || 15;
      return (
        <div
          className={`bg-gradient-to-r ${className}`}
          style={{
            backgroundImage: `linear-gradient(-45deg, ${colors.join(',')})`,
            backgroundSize: '400% 400%',
            animation: `gradient ${30 - speed}s ease infinite`,
            ...style
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes gradient {
                0% { background-position: 0% 50% }
                50% { background-position: 100% 50% }
                100% { background-position: 0% 50% }
              }
            `
          }} />
          {children}
        </div>
      );

    case ThemeEffectType.NEON:
    case ThemeEffectType.CYBER:
      const glowColor = effect.glowColor || 'rgba(123, 97, 255, 0.6)';
      const glowIntensity = effect.intensity || 1;
      const hasScanLines = effect.scanLines !== false;
      return (
        <div
          className={`relative cyber-container ${className} ${hasScanLines ? 'before:absolute before:inset-0 before:z-10 before:pointer-events-none before:bg-scan-lines before:opacity-5' : ''}`}
          style={{
            ...style,
            boxShadow: `0 0 ${5 * glowIntensity}px ${glowColor}, inset 0 0 ${3 * glowIntensity}px ${glowColor}`,
          }}
        >
          {children}
        </div>
      );

    case ThemeEffectType.PULSE:
      const pulseSpeed = effect.speed || 2;
      const pulseColor = effect.color || 'currentColor';
      const minOpacity = effect.minOpacity || 0.7;
      const maxOpacity = effect.maxOpacity || 1;
      return (
        <div
          className={`pulse-effect ${className}`}
          style={{
            animation: `pulse ${pulseSpeed}s infinite ease-in-out`,
            color: pulseColor,
            ...style
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes pulse {
                0% { opacity: ${minOpacity}; }
                50% { opacity: ${maxOpacity}; }
                100% { opacity: ${minOpacity}; }
              }
            `
          }} />
          {children}
        </div>
      );
      
    default:
      return <div className={className} style={style}>{children}</div>;
  }
};

export default ThemeEffectProvider;
