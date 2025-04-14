
import React from 'react';
import { ThemeEffect, ThemeEffectType } from '@/shared/types/shared.types';
import { 
  normalizeEffectType
} from '@/shared/types/theme/effects.types';

interface EffectRendererProps {
  effect: ThemeEffect;
}

const EffectRenderer: React.FC<EffectRendererProps> = ({ effect }) => {
  if (!effect || !effect.enabled) {
    return null;
  }

  // Normalize effect type (for backward compatibility)
  const normalizedType = normalizeEffectType(effect.type as string);

  switch (normalizedType) {
    case ThemeEffectType.NOISE:
    case ThemeEffectType.GLITCH:
      return (
        <>
          <div className="noise-overlay"></div>
          <style jsx>
            {`
              .noise-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E");
                pointer-events: none;
                z-index: 9999;
                opacity: ${effect.intensity || 0.15};
                mix-blend-mode: overlay;
              }
            `}
          </style>
        </>
      );

    case ThemeEffectType.NEON:
    case ThemeEffectType.CYBER:
      return (
        <>
          <div className="neon-overlay"></div>
          <style jsx>
            {`
              .neon-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: ${effect.scanLines ? 
                  `repeating-linear-gradient(
                    0deg,
                    rgba(0, 0, 0, 0.15),
                    rgba(0, 0, 0, 0.15) 1px,
                    transparent 1px,
                    transparent 2px
                  )` : 'transparent'};
                pointer-events: none;
                z-index: 9998;
                mix-blend-mode: overlay;
              }

              :root {
                --neon-glow: ${effect.glowColor || '#00f8ff'};
              }
            `}
          </style>
        </>
      );

    case ThemeEffectType.BLUR:
    case ThemeEffectType.MORPH:
      return (
        <>
          <div className="blur-overlay"></div>
          <style>
            {`
              .blur-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                backdrop-filter: blur(${effect.intensity || 1}px);
                pointer-events: none;
                z-index: 9997;
                opacity: 0.2;
                mix-blend-mode: overlay;
              }
            `}
          </style>
        </>
      );

    case ThemeEffectType.GRADIENT:
      const colors = effect.colors || ['#ff00cc', '#3333ff'];
      return (
        <>
          <div className="gradient-overlay"></div>
          <style>
            {`
              .gradient-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, ${colors.join(', ')});
                pointer-events: none;
                z-index: 9996;
                opacity: ${effect.intensity || 0.1};
                mix-blend-mode: overlay;
              }
            `}
          </style>
        </>
      );

    case ThemeEffectType.PULSE:
      return (
        <>
          <div className="pulse-overlay"></div>
          <style>
            {`
              .pulse-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${effect.color || '#00f8ff'};
                pointer-events: none;
                z-index: 9995;
                animation: pulse ${effect.speed || 5}s infinite ease-in-out;
                opacity: 0;
                mix-blend-mode: overlay;
              }

              @keyframes pulse {
                0% { opacity: ${effect.minOpacity || 0}; }
                50% { opacity: ${effect.maxOpacity || 0.1}; }
                100% { opacity: ${effect.minOpacity || 0}; }
              }
            `}
          </style>
        </>
      );

    case ThemeEffectType.PARTICLE:
      return (
        <>
          <div className="particle-container"></div>
          <style>
            {`
              .particle-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: 9994;
              }
            `}
          </style>
        </>
      );

    default:
      return null;
  }
};

export default EffectRenderer;
