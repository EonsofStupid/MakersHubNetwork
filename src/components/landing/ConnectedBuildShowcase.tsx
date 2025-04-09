
import React, { useEffect, useState } from 'react';
import { useComponentTokens } from '@/hooks/useComponentTokens';
import { cn } from '@/lib/utils';
import { Eye, ThumbsUp, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useQuery } from '@tanstack/react-query';

interface Build {
  id: string;
  title: string;
  creator?: string;
  imageUrl?: string;
  likes?: number;
  views?: number;
  comments?: number;
  category?: string;
  description?: string;
  submitted_by?: string;
  display_name?: string;
  avatar_url?: string;
  images?: string[];
}

interface BuildShowcaseProps {
  title?: string;
  subtitle?: string;
  maxBuilds?: number;
}

export function ConnectedBuildShowcase({ 
  title = "Community Builds", 
  subtitle = "Check out these amazing 3D printer builds from our community",
  maxBuilds = 3
}: BuildShowcaseProps) {
  const styles = useComponentTokens('BuildShowcase');
  const logger = useLogger('ConnectedBuildShowcase', LogCategory.UI);
  
  // Fetch builds from database
  const { data: builds, isLoading, error } = useQuery({
    queryKey: ['community-builds'],
    queryFn: async () => {
      try {
        logger.info('Fetching community builds');
        
        // Use a join to get the submitter's profile info
        const { data, error } = await supabase
          .from('build_profiles')
          .select(`
            id,
            title,
            description,
            images,
            status,
            submitted_by,
            complexity_score,
            profiles:submitted_by (display_name, avatar_url)
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(maxBuilds);
        
        if (error) {
          throw error;
        }
        
        // Transform to our Build interface
        return data.map((build: any): Build => ({
          id: build.id,
          title: build.title,
          description: build.description,
          creator: build.profiles?.display_name || 'Community Member',
          imageUrl: build.images && build.images.length > 0 ? build.images[0] : undefined,
          likes: Math.floor(Math.random() * 200) + 20, // Placeholder until we have real data
          views: Math.floor(Math.random() * 2000) + 100, // Placeholder until we have real data
          comments: Math.floor(Math.random() * 50) + 5, // Placeholder until we have real data
          category: build.complexity_score > 7 ? 'Advanced' : build.complexity_score > 4 ? 'Intermediate' : 'Beginner'
        }));
      } catch (err) {
        logger.error('Error fetching community builds', { 
          details: { error: err instanceof Error ? err.message : String(err) }
        });
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Ensure we have default styles to prevent TS errors
  const defaultStyles = {
    container: "py-16 bg-background/20 backdrop-blur-sm",
    heading: "text-3xl font-bold text-center mb-4",
    subheading: "text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4",
    card: "build-card overflow-hidden rounded-lg border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300",
    cardImage: "w-full h-64 object-cover transition-transform duration-500",
    cardOverlay: "absolute inset-0 bg-gradient-to-t from-background to-transparent",
    cardContent: "p-4",
    cardTitle: "font-bold text-lg mb-1 line-clamp-1",
    cardCreator: "text-sm text-muted-foreground mb-2",
    cardStats: "flex items-center justify-between text-xs text-muted-foreground",
    loadingState: "flex flex-col items-center justify-center py-20",
    loadingText: "text-muted-foreground mt-4",
    errorState: "text-center py-20 text-destructive"
  };
  
  // Default placeholder builds for when there's no data
  const defaultBuilds: Build[] = [
    {
      id: '1',
      title: 'VORON 2.4 Tophat Mod',
      creator: 'MakerD',
      imageUrl: '/images/builds/voron-mod.jpg',
      likes: 124,
      views: 1420,
      comments: 32,
      category: 'Mod'
    },
    {
      id: '2',
      title: 'Ender 3 V2 Enclosure',
      creator: 'PrintMaster',
      imageUrl: '/images/builds/ender-enclosure.jpg',
      likes: 89,
      views: 950,
      comments: 24,
      category: 'Enclosure'
    },
    {
      id: '3',
      title: 'Prusa MK3S+ Custom Toolhead',
      creator: 'FilamentFan',
      imageUrl: '/images/builds/prusa-toolhead.jpg',
      likes: 215,
      views: 2380,
      comments: 47,
      category: 'Custom Part'
    }
  ];
  
  // Use real data if available, otherwise fall back to defaults
  const displayBuilds = (builds && builds.length > 0) ? builds : defaultBuilds;
  
  // Merge component tokens with default styles
  const mergedStyles = { ...defaultStyles, ...styles };
  
  return (
    <section className={cn(mergedStyles.container)}>
      <div className="w-full max-w-[2000px] mx-auto">
        <h2 className={cn(mergedStyles.heading, "cyber-gradient-text")}>
          {title}
        </h2>
        <p className={cn(mergedStyles.subheading)}>
          {subtitle}
        </p>
        
        {isLoading && (
          <div className={cn(mergedStyles.loadingState)}>
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className={cn(mergedStyles.loadingText)}>Loading amazing community builds...</p>
          </div>
        )}
        
        {error && (
          <div className={cn(mergedStyles.errorState)}>
            <p>Unable to load builds. Please try again later.</p>
          </div>
        )}
        
        {!isLoading && !error && (
          <div className={cn(mergedStyles.grid)}>
            {displayBuilds.map((build) => (
              <div key={build.id} className={cn(mergedStyles.card, "cyber-border-glow animate-float")}>
                <div className="build-card-image-container relative aspect-video overflow-hidden">
                  <img 
                    src={build.imageUrl || '/images/placeholders/build-placeholder.jpg'} 
                    alt={build.title}
                    className={cn(mergedStyles.cardImage)}
                  />
                  <div className={cn(mergedStyles.cardOverlay)}></div>
                  <span className="build-card-category absolute bottom-2 left-2 inline-block px-2 py-1 text-xs rounded-md backdrop-blur-md bg-primary/30 text-primary-foreground border border-primary/40">
                    {build.category || 'Community Build'}
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
        )}
        
        <div className="text-center mt-10">
          <a href="/community" className="inline-block px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-300 cyber-glow">
            View All Community Builds
          </a>
        </div>
      </div>
    </section>
  );
}
