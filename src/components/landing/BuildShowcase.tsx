
import React from 'react';
import { useComponentTokens } from '@/hooks/useComponentTokens';
import { cn } from '@/lib/utils';
import { Eye, ThumbsUp, MessageSquare } from 'lucide-react';

interface Build {
  id: string;
  title: string;
  creator: string;
  imageUrl: string;
  likes: number;
  views: number;
  comments: number;
  category: string;
}

interface BuildShowcaseProps {
  title?: string;
  subtitle?: string;
  builds?: Build[];
}

export function BuildShowcase({ 
  title = "Community Builds", 
  subtitle = "Check out these amazing 3D printer builds from our community",
  builds = [] 
}: BuildShowcaseProps) {
  const styles = useComponentTokens('BuildShowcase');
  
  // Ensure we have default styles to prevent TS errors
  const defaultStyles = {
    container: "py-16 bg-background/20 backdrop-blur-sm",
    heading: "text-3xl font-bold text-center mb-4",
    subheading: "text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4",
    card: "build-card overflow-hidden rounded-lg border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300",
    cardImage: "w-full h-full object-cover transition-transform duration-500",
    cardOverlay: "absolute inset-0 bg-gradient-to-t from-background to-transparent",
    cardContent: "p-4",
    cardTitle: "font-bold text-lg mb-1 line-clamp-1",
    cardCreator: "text-sm text-muted-foreground mb-2",
    cardStats: "flex items-center justify-between text-xs text-muted-foreground"
  };
  
  const defaultBuilds: Build[] = [
    {
      id: '1',
      title: 'VORON 2.4 Tophat Mod',
      creator: 'MakerD',
      imageUrl: 'https://via.placeholder.com/400x300/121218/00F0FF?text=VORON+2.4',
      likes: 124,
      views: 1420,
      comments: 32,
      category: 'Mod'
    },
    {
      id: '2',
      title: 'Ender 3 V2 Enclosure',
      creator: 'PrintMaster',
      imageUrl: 'https://via.placeholder.com/400x300/121218/FF2D6E?text=Ender+3+V2',
      likes: 89,
      views: 950,
      comments: 24,
      category: 'Enclosure'
    },
    {
      id: '3',
      title: 'Prusa MK3S+ Custom Toolhead',
      creator: 'FilamentFan',
      imageUrl: 'https://via.placeholder.com/400x300/121218/8B5CF6?text=Prusa+MK3S%2B',
      likes: 215,
      views: 2380,
      comments: 47,
      category: 'Custom Part'
    }
  ];
  
  const displayBuilds = builds.length > 0 ? builds : defaultBuilds;
  
  // Merge component tokens with default styles
  const mergedStyles = { ...defaultStyles, ...styles };
  
  return (
    <section className={cn(mergedStyles.container)}>
      <div className="w-full max-w-[2000px] mx-auto">
        <h2 className={cn(mergedStyles.heading)}>
          {title}
        </h2>
        <p className={cn(mergedStyles.subheading)}>
          {subtitle}
        </p>
        
        <div className={cn(mergedStyles.grid)}>
          {displayBuilds.map((build) => (
            <div key={build.id} className={cn(mergedStyles.card)}>
              <div className="build-card-image-container relative aspect-video overflow-hidden">
                <img 
                  src={build.imageUrl} 
                  alt={build.title}
                  className={cn(mergedStyles.cardImage)}
                />
                <div className={cn(mergedStyles.cardOverlay)}></div>
                <span className="build-card-category absolute bottom-2 left-2 inline-block px-2 py-1 text-xs rounded-md backdrop-blur-md bg-primary/30 text-primary-foreground border border-primary/40">
                  {build.category}
                </span>
              </div>
              
              <div className={cn(mergedStyles.cardContent)}>
                <h3 className={cn(mergedStyles.cardTitle)}>
                  {build.title}
                </h3>
                <p className={cn(mergedStyles.cardCreator)}>
                  by {build.creator}
                </p>
                
                <div className={cn(mergedStyles.cardStats)}>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {build.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {build.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {build.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
