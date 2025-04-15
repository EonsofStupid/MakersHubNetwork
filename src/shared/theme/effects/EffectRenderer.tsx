
import React from 'react';
import { ThemeEffectType as EffectTypeEnum } from '@/shared/types/shared.types';

type ThemeEffectTypeType = keyof typeof EffectTypeEnum;

interface EffectRendererProps {
  type: ThemeEffectTypeType;
  children: React.ReactNode;
  config?: Record<string, any>;
}

export const EffectRenderer: React.FC<EffectRendererProps> = ({
  type,
  children,
  config = {}
}) => {
  // Simplified effect renderer implementation
  const renderEffect = () => {
    switch(type) {
      case 'CYBER':
      case 'NEON':
        return (
          <div className="cyber-effect-container">
            {children}
            <div className="cyber-glow" style={{ color: config.glowColor || '#00eeff' }} />
          </div>
        );
      case 'GLITCH':
        return (
          <div className="glitch-effect-container">
            {children}
            <div className="glitch-overlay" />
          </div>
        );
      default:
        return children;
    }
  };

  return (
    <div className={`effect-wrapper effect-${type.toLowerCase()}`}>
      {renderEffect()}
    </div>
  );
};

export default EffectRenderer;
