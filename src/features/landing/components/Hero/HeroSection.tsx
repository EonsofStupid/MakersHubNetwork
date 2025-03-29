
import React from 'react';
import { HeroButton } from './HeroButton';
import { useFeatureEffect } from '../../hooks/useFeatureEffect';
import { HeroProps } from '../../types';

export const HeroSection: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  ctaButtons
}) => {
  const { handleHover, handleLeave } = useFeatureEffect();

  return (
    <div className="hero-container">
      <h1 className="hero-title">{title}</h1>
      
      <div className="my-8 relative overflow-hidden">
        <h2 className="hero-subtitle">{subtitle}</h2>
        <div className="hero-description">{description}</div>
      </div>
      
      <div className="hero-actions">
        {ctaButtons.map((button) => (
          <HeroButton
            key={button.id}
            id={button.id}
            label={button.label}
            href={button.href}
            primary={button.primary}
            secondary={button.secondary}
            onHover={handleHover}
            onLeave={handleLeave}
          />
        ))}
      </div>
    </div>
  );
};
