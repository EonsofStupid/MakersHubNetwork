
import React from 'react';
import { useSiteTheme } from '@/app/components/theme/SiteThemeProvider';
import { cn } from '@/lib/utils';

export const BuildShowcase: React.FC = () => {
  const { componentStyles } = useSiteTheme();
  
  const styles = componentStyles?.BuildShowcase || {
    container: "py-16 bg-background/50 backdrop-blur-sm relative",
    title: "text-3xl font-bold text-center mb-12",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4",
    card: "bg-card border border-border rounded-lg overflow-hidden shadow-lg",
    imageContainer: "h-48 overflow-hidden",
    image: "object-cover w-full h-full",
    content: "p-4",
    buildTitle: "text-xl font-semibold mb-2",
    buildDescription: "text-muted-foreground text-sm"
  };
  
  // Sample showcase data
  const showcaseBuilds = [
    {
      id: 1,
      title: "Voron 2.4",
      description: "High-speed CoreXY 3D printer with exceptional print quality",
      imageUrl: "https://via.placeholder.com/800x600?text=Voron+2.4"
    },
    {
      id: 2,
      title: "Prusa i3 MK3S+",
      description: "Reliable workhorse with excellent print quality and ease of use",
      imageUrl: "https://via.placeholder.com/800x600?text=Prusa+i3"
    },
    {
      id: 3,
      title: "Ender 3 Neo",
      description: "Budget-friendly printer with extensive community mods",
      imageUrl: "https://via.placeholder.com/800x600?text=Ender+3+Neo"
    }
  ];

  return (
    <section className={cn(styles.container)}>
      <h2 className={cn(styles.title)}>Featured Community Builds</h2>
      <div className={cn(styles.grid)}>
        {showcaseBuilds.map(build => (
          <div key={build.id} className={cn(styles.card)}>
            <div className={cn(styles.imageContainer)}>
              <img
                src={build.imageUrl}
                alt={build.title}
                className={cn(styles.image)}
              />
            </div>
            <div className={cn(styles.content)}>
              <h3 className={cn(styles.buildTitle)}>{build.title}</h3>
              <p className={cn(styles.buildDescription)}>{build.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
