import React from 'react';
import { FeatureCta, FeatureCtaProps } from './FeatureCta';
import { Sparkles, Code, Rocket, Globe, Zap, Gem } from 'lucide-react';
import { useSiteTheme } from '@/app/theme/SiteThemeProvider';
import { cn } from '@/lib/utils';

export const FeaturesSection = () => {
  const { componentStyles } = useSiteTheme();
  
  const styles = componentStyles?.FeaturesSection || {
    container: "py-16 bg-background/30 backdrop-blur-sm relative",
    title: "text-3xl font-bold text-center mb-12",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4",
  };
  
  const features: Omit<FeatureCtaProps, 'id'>[] = [
    {
      title: "Build Showcase",
      description: "Show off your 3D printer builds with detailed specifications and high-quality images.",
      icon: <Sparkles className="h-6 w-6" />,
      ctaText: "Show Your Build",
      ctaLink: "/builds/create"
    },
    {
      title: "Community Support",
      description: "Get help with your builds from a community of passionate makers.",
      icon: <Globe className="h-6 w-6" />,
      ctaText: "Join Community",
      ctaLink: "/community"
    },
    {
      title: "Firmware Customization",
      description: "Share and discover custom firmware configurations for popular 3D printers.",
      icon: <Code className="h-6 w-6" />,
      ctaText: "Explore Firmware",
      ctaLink: "/firmware"
    },
    {
      title: "Part Marketplace",
      description: "Find upgrades and replacement parts specifically for your printer model.",
      icon: <Gem className="h-6 w-6" />,
      ctaText: "Find Parts",
      ctaLink: "/parts"
    },
    {
      title: "Print Troubleshooting",
      description: "Solve common printing issues with our troubleshooting guides and community advice.",
      icon: <Zap className="h-6 w-6" />,
      ctaText: "Fix Issues",
      ctaLink: "/troubleshooting"
    },
    {
      title: "Build Guides",
      description: "Step-by-step guides for popular printer builds and modifications.",
      icon: <Rocket className="h-6 w-6" />,
      ctaText: "View Guides",
      ctaLink: "/guides"
    }
  ];

  return (
    <section className={cn(styles.container)}>
      <h2 className={cn(styles.title)}>Unleash Your 3D Printing Potential</h2>
      <div className={cn(styles.grid)}>
        {features.map((feature, index) => (
          <FeatureCta
            key={index}
            id={`feature-${index}`}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            ctaText={feature.ctaText}
            ctaLink={feature.ctaLink}
          />
        ))}
      </div>
    </section>
  );
};
