import React from 'react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/lib/utils';
import { ThemeEffectProvider } from '@/shared/ui/theme/effects/ThemeEffectProvider';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ThemeEffect } from '@/app/theme/types/effects';

export interface FeatureCtaProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaText: string;
  ctaLink: string;
  className?: string;
  effect?: ThemeEffect;
}

export const FeatureCta = ({ 
  id,
  title, 
  description, 
  icon, 
  ctaText, 
  ctaLink, 
  className,
  effect,
}: FeatureCtaProps) => {
  return (
    <ThemeEffectProvider effect={effect} className={cn(
      "relative backdrop-blur-sm rounded-lg overflow-hidden",
      "border border-primary/10 group",
      "p-6 h-full flex flex-col",
      "transition-all hover:-translate-y-1 hover:shadow-lg",
      className
    )}>
      <motion.div 
        className="mb-4 p-3 rounded-full bg-primary/10 w-fit"
        whileHover={{ rotate: [0, 10, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-4 flex-grow">
        {description}
      </p>
      
      <Button 
        asChild 
        variant="ghost" 
        className="group/button pl-0 hover:pl-2 transition-all justify-start"
      >
        <a href={ctaLink}>
          <ArrowRight className="mr-2 h-4 w-0 group-hover/button:w-4 transition-all overflow-hidden" />
          {ctaText}
        </a>
      </Button>
    </ThemeEffectProvider>
  );
};
