
import { useCallback } from 'react';
import { useThemeEffects } from '@/hooks/useThemeEffects';
import { useThemeEffect } from '@/components/theme/effects/ThemeEffectProvider';
import { EffectRenderer } from '@/components/theme/effects/EffectRenderer';
import { useSiteTheme } from '@/components/theme/SiteThemeProvider';
import { cn } from '@/lib/utils';
import { CyberEffect } from '@/theme/types/effects';

export interface FeatureCtaProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  ctaText?: string;
  ctaLink?: string;
  id: string;
}

export const FeatureCta = ({
  title,
  description,
  icon,
  ctaText = "Learn More",
  ctaLink = "#",
  id
}: FeatureCtaProps) => {
  const { applyRandomEffect, removeEffect } = useThemeEffects();
  const { addEffect, removeEffect: removeThemeEffect, getEffectForElement } = useThemeEffect();
  const { componentStyles } = useSiteTheme();

  const styles = componentStyles?.FeatureCta || {
    container: "p-6 bg-card border border-border rounded-lg transition-all duration-300 hover:shadow-md hover:border-primary/30",
    title: "text-xl font-semibold mb-2",
    description: "text-muted-foreground mb-4",
    cta: "text-primary hover:text-primary/80 hover:underline inline-flex items-center"
  };

  const handleHover = useCallback(() => {
    const elementId = `feature-${id}`;
    const effectId = `${elementId}-glow`;
    
    // Cast to the specific effect type
    const cyberEffect: CyberEffect = {
      id: effectId,
      type: 'cyber',
      enabled: true,
      duration: 2000,
      glowColor: '#00F0FF',
      textShadow: true,
      scanLines: false
    };
    
    addEffect(elementId, cyberEffect);
    
    applyRandomEffect(elementId, {
      types: ['cyber'],
      colors: ['#00F0FF'],
      duration: 2000
    });
    
    return () => {
      removeThemeEffect(effectId);
      removeEffect(elementId);
    };
  }, [id, addEffect, applyRandomEffect, removeThemeEffect, removeEffect]);

  const effect = getEffectForElement(`feature-${id}`);

  return (
    <EffectRenderer 
      effect={effect} 
      className={cn(styles.container)}
    >
      <div 
        id={`feature-${id}`} 
        className="relative z-10"
        onMouseEnter={handleHover}
        onMouseLeave={() => removeThemeEffect(`feature-${id}-glow`)}
      >
        {icon && <div className="mb-4 text-primary">{icon}</div>}
        <h3 className={cn(styles.title)}>{title}</h3>
        <p className={cn(styles.description)}>{description}</p>
        <a href={ctaLink} className={cn(styles.cta)}>
          {ctaText}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </a>
      </div>
    </EffectRenderer>
  );
};
