
import React from "react";
import { Link } from "react-router-dom";
import { Database, Forum, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeEffects } from "@/hooks/useThemeEffects";

type FeatureType = "database" | "forum" | "chat";

interface FeatureCtaProps {
  type: FeatureType;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

export const FeatureCta = ({ type, title, description, ctaText, ctaLink, className }: FeatureCtaProps) => {
  const { applyRandomEffect, removeEffect, getEffectForElement } = useThemeEffects({
    debounceDelay: 100,
    maxActiveEffects: 5
  });

  // Generate a unique ID for this CTA
  const ctaId = `feature-cta-${type}`;
  
  // Get the appropriate icon for this feature
  const Icon = React.useMemo(() => {
    switch (type) {
      case "database":
        return Database;
      case "forum":
        return Forum;
      case "chat":
        return MessageSquare;
      default:
        return Database;
    }
  }, [type]);

  // Get the appropriate styles for this feature
  const getFeatureStyles = () => {
    switch (type) {
      case "database":
        return {
          container: "border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10",
          icon: "text-primary",
          button: "bg-primary/20 text-primary hover:bg-primary/30"
        };
      case "forum":
        return {
          container: "border-secondary/30 hover:border-secondary/60 bg-secondary/5 hover:bg-secondary/10",
          icon: "text-secondary",
          button: "bg-secondary/20 text-secondary hover:bg-secondary/30"
        };
      case "chat":
        return {
          container: "border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60 bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10",
          icon: "text-[#8B5CF6]",
          button: "bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30"
        };
    }
  };

  const styles = getFeatureStyles();
  const effect = getEffectForElement(ctaId);

  const handleMouseEnter = () => {
    applyRandomEffect(ctaId, {
      types: ['glitch', 'gradient', 'cyber', 'pulse'],
      colors: type === 'database' ? ['#00F0FF'] 
           : type === 'forum' ? ['#FF2D6E'] 
           : ['#8B5CF6'],
      duration: 2000
    });
  };

  const handleMouseLeave = () => {
    removeEffect(`${ctaId}-glitch`);
    removeEffect(`${ctaId}-gradient`);
    removeEffect(`${ctaId}-cyber`);
    removeEffect(`${ctaId}-pulse`);
  };

  return (
    <div 
      id={ctaId}
      className={cn(
        "feature-cta relative overflow-hidden rounded-lg border p-6 transition-all duration-300",
        "backdrop-blur-md shadow-lg hover:shadow-xl transform hover:-translate-y-1",
        styles.container,
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-row items-start gap-4">
        <div className={cn("p-2 rounded-full bg-background/50", styles.icon)}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <Link 
            to={ctaLink} 
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-md font-medium",
              "transition-colors duration-300",
              styles.button
            )}
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
};
