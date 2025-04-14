
import React, { useMemo } from 'react';
import { ThemeEffect, ThemeEffectType, ThemeEffectProps } from '@/shared/types';

/**
 * Renders a theme effect based on its type
 * This component provides visual effects that can be applied to its children
 */
export function EffectRenderer({
  effect,
  intensity = 1,
  className = '',
  children
}: ThemeEffectProps) {
  // If effect is disabled or not provided, just render the children
  if (!effect || !effect.enabled) {
    return <>{children}</>;
  }
  
  // Determine type and configuration
  const type = effect.type;
  const customIntensity = effect.intensity || intensity;
  
  // Render the appropriate effect based on type
  switch (type) {
    case ThemeEffectType.GLITCH:
    case ThemeEffectType.NOISE:
      return (
        <GlitchEffect effect={effect} intensity={customIntensity} className={className}>
          {children}
        </GlitchEffect>
      );
    
    case ThemeEffectType.GRADIENT:
      return (
        <GradientEffect effect={effect} intensity={customIntensity} className={className}>
          {children}
        </GradientEffect>
      );
    
    case ThemeEffectType.NEON:
    case ThemeEffectType.CYBER:
      return (
        <CyberEffect effect={effect} intensity={customIntensity} className={className}>
          {children}
        </CyberEffect>
      );
    
    case ThemeEffectType.PULSE:
      return (
        <PulseEffect effect={effect} intensity={customIntensity} className={className}>
          {children}
        </PulseEffect>
      );
    
    case ThemeEffectType.PARTICLE:
      return (
        <ParticleEffect effect={effect} intensity={customIntensity} className={className}>
          {children}
        </ParticleEffect>
      );
    
    case ThemeEffectType.BLUR:
    case ThemeEffectType.MORPH:
      return (
        <BlurEffect effect={effect} intensity={customIntensity} className={className}>
          {children}
        </BlurEffect>
      );
    
    default:
      return <>{children}</>;
  }
}

// Glitch/Noise effect
function GlitchEffect({ effect, intensity, className, children }: ThemeEffectProps) {
  const uniqueId = useMemo(() => `glitch-${Math.random().toString(36).substr(2, 9)}`, []);
  const color = effect.color || 'currentColor';
  const frequency = effect.frequency || 2;
  const amplitude = effect.amplitude || 1;
  
  // Generate keyframes for the glitch effect
  const keyframes = `
    0% { transform: translate(0); }
    20% { transform: translate(${amplitude * intensity * -0.5}px, ${amplitude * intensity * 0.5}px); }
    40% { transform: translate(${amplitude * intensity * 0.5}px, ${amplitude * intensity * -0.5}px); }
    60% { transform: translate(${amplitude * intensity * -0.5}px, ${amplitude * intensity * 0.5}px); }
    80% { transform: translate(${amplitude * intensity * 0.5}px, ${amplitude * intensity * -0.5}px); }
    100% { transform: translate(0); }
  `;
  
  return (
    <div className={`relative ${className}`} style={{ color }}>
      <style jsx>{`
        @keyframes glitch-${uniqueId} {
          ${keyframes}
        }
        
        .glitch-container-${uniqueId}::before,
        .glitch-container-${uniqueId}::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: ${0.5 * intensity};
        }
        
        .glitch-container-${uniqueId}::before {
          animation: glitch-${uniqueId} ${frequency / intensity}s infinite;
          color: rgba(255, 0, 0, 0.7);
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-2px);
        }
        
        .glitch-container-${uniqueId}::after {
          animation: glitch-${uniqueId} ${frequency / intensity * 1.1}s infinite reverse;
          color: rgba(0, 255, 255, 0.7);
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
          transform: translate(2px);
        }
      `}</style>
      
      <div className={`glitch-container-${uniqueId}`} data-text={typeof children === 'string' ? children : ''}>
        {children}
      </div>
    </div>
  );
}

// Gradient effect
function GradientEffect({ effect, intensity, className, children }: ThemeEffectProps) {
  const uniqueId = useMemo(() => `gradient-${Math.random().toString(36).substr(2, 9)}`, []);
  const colors = (effect.colors as string[]) || ['#ff00cc', '#3333ff', '#00ff99'];
  const speed = effect.speed || 3;
  
  // Generate keyframes for the gradient effect
  const keyframes = `
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;
  
  return (
    <div className={`relative ${className}`}>
      <style jsx>{`
        @keyframes gradient-${uniqueId} {
          ${keyframes}
        }
        
        .gradient-container-${uniqueId} {
          background: linear-gradient(-45deg, ${colors.join(', ')});
          background-size: ${200 + (intensity * 200)}% ${200 + (intensity * 200)}%;
          animation: gradient-${uniqueId} ${speed / intensity}s ease infinite;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
      `}</style>
      
      <div className={`gradient-container-${uniqueId}`}>
        {children}
      </div>
    </div>
  );
}

// Cyber/Neon effect
function CyberEffect({ effect, intensity, className, children }: ThemeEffectProps) {
  const glowColor = effect.glowColor || 'rgba(0, 255, 255, 0.7)';
  const scanLines = effect.scanLines !== false;
  
  const style = {
    textShadow: `
      0 0 ${2 * intensity}px ${glowColor},
      0 0 ${4 * intensity}px ${glowColor},
      0 0 ${6 * intensity}px ${glowColor}
    `,
    position: 'relative' as const,
    color: glowColor
  };
  
  const scanLinesStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `repeating-linear-gradient(
      transparent 0px,
      rgba(0, 0, 0, 0.1) 1px,
      transparent 2px
    )`,
    pointerEvents: 'none' as const,
    opacity: 0.15 * intensity
  };
  
  return (
    <div className={className} style={{ position: 'relative' }}>
      <div style={style}>
        {children}
      </div>
      {scanLines && <div style={scanLinesStyle}></div>}
    </div>
  );
}

// Pulse effect
function PulseEffect({ effect, intensity, className, children }: ThemeEffectProps) {
  const uniqueId = useMemo(() => `pulse-${Math.random().toString(36).substr(2, 9)}`, []);
  const color = effect.color || 'currentColor';
  const minOpacity = effect.minOpacity || 0.5;
  const maxOpacity = effect.maxOpacity || 1;
  
  // Generate keyframes for the pulse effect
  const keyframes = `
    0%, 100% { opacity: ${minOpacity + ((maxOpacity - minOpacity) * intensity)}; }
    50% { opacity: ${minOpacity}; }
  `;
  
  return (
    <div className={`relative ${className}`}>
      <style jsx>{`
        @keyframes pulse-${uniqueId} {
          ${keyframes}
        }
        
        .pulse-container-${uniqueId} {
          color: ${color};
          animation: pulse-${uniqueId} ${2 / intensity}s ease-in-out infinite;
        }
      `}</style>
      
      <div className={`pulse-container-${uniqueId}`}>
        {children}
      </div>
    </div>
  );
}

// Particle effect
function ParticleEffect({ effect, intensity, className, children }: ThemeEffectProps) {
  const color = effect.color || 'rgba(255, 255, 255, 0.7)';
  const count = effect.count || 20;
  
  const wrapperStyle = {
    position: 'relative' as const,
    overflow: 'hidden' as const
  };
  
  return (
    <div className={className} style={wrapperStyle}>
      {/* Particle container would go here - requires a more complex implementation */}
      {/* For now, just showing the children */}
      {children}
    </div>
  );
}

// Blur/Morph effect
function BlurEffect({ effect, intensity, className, children }: ThemeEffectProps) {
  const blurAmount = intensity * (effect.intensity || 1);
  
  const style = {
    filter: `blur(${blurAmount * 2}px)`,
    transition: 'filter 0.3s ease'
  };
  
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
