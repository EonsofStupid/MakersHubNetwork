
import React, { useCallback } from 'react';
import { useSiteTheme } from '@/app/components/theme/SiteThemeProvider';
import { cn } from '@/lib/utils';

export interface FeatureCtaProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  ctaText?: string;
  ctaLink?: string;
  id: string;
}

export const FeatureCta: React.FC<FeatureCtaProps> = ({
  title,
  description,
  icon,
  ctaText = "Learn More",
  ctaLink = "#",
  id
}) => {
  const { componentStyles } = useSiteTheme();

  const styles = componentStyles?.FeatureCta || {
    container: "p-6 bg-card border border-border rounded-lg transition-all duration-300 hover:shadow-md hover:border-primary/30",
    title: "text-xl font-semibold mb-2",
    description: "text-muted-foreground mb-4",
    cta: "text-primary hover:text-primary/80 hover:underline inline-flex items-center"
  };

  const handleHover = useCallback(() => {
    // Simplified hover handler without theme effects
    return () => {};
  }, [id]);

  return (
    <div className={cn(styles.container)}>
      <div 
        id={`feature-${id}`} 
        className="relative z-10"
        onMouseEnter={handleHover}
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
    </div>
  );
};
