
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Database, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FeatureItemProps } from '../../types';
import { useFeatureEffect } from '../../hooks/useFeatureEffect';

export const FeatureCard: React.FC<FeatureItemProps> = ({
  type,
  title,
  description,
  ctaText,
  ctaLink,
  className
}) => {
  const { handleHover, handleLeave, getEffectFor } = useFeatureEffect();

  // Generate a unique ID for this CTA
  const ctaId = `feature-cta-${type}`;
  
  // Get the appropriate icon for this feature
  const Icon = useMemo(() => {
    switch (type) {
      case "database":
        return Database;
      case "forum":
      case "chat":
        return MessageSquare;
      default:
        return Database;
    }
  }, [type]);

  const effect = getEffectFor(ctaId);

  return (
    <div 
      id={ctaId}
      className={cn(
        "feature-cta",
        `feature-cta-${type}`,
        className
      )}
      onMouseEnter={() => handleHover(ctaId)}
      onMouseLeave={() => handleLeave(ctaId)}
    >
      <div className="flex flex-row items-start gap-4">
        <div className={cn("feature-cta-icon")}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="feature-cta-title">{title}</h3>
          <p className="feature-cta-description">{description}</p>
          
          <Link 
            to={ctaLink} 
            className="feature-cta-button"
          >
            {ctaText}
          </Link>
        </div>
      </div>
      
      <div className="feature-cta-hover-effect"></div>
    </div>
  );
};
