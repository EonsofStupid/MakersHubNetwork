import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { supabase } from '@/integrations/supabase/client';
import { useHomeStore } from '../store/home.store';
import { Card } from '@/shared/ui/card';

interface FeaturedPost {
  id: string;
  title: string;
  description?: string;
  excerpt?: string;
  image_url?: string;
  thumbnail_url?: string;
  slug: string;
  created_at: string;
}

interface FeaturedSectionProps {
  className?: string;
}

export function FeaturedSection({ className }: FeaturedSectionProps) {
  const { layout } = useHomeStore();
  const [post, setPost] = useState<FeaturedPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedPost() {
      setIsLoading(true);
      try {
        if (layout.featured_override) {
          // Load specific post if override is set
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', layout.featured_override)
            .single();
            
          if (error) throw error;
          
          setPost({
            id: data.id,
            title: data.title,
            description: data.excerpt || '',
            excerpt: data.excerpt,
            image_url: data.thumbnail_url,
            thumbnail_url: data.thumbnail_url,
            slug: data.slug,
            created_at: data.created_at
          });
        } else {
          // Otherwise load latest featured post
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (error) {
            // Fallback to latest post if no featured post
            const { data: latestData, error: latestError } = await supabase
              .from('blog_posts')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
              
            if (latestError) throw latestError;
            
            setPost({
              id: latestData.id,
              title: latestData.title,
              description: latestData.excerpt || '',
              excerpt: latestData.excerpt,
              image_url: latestData.thumbnail_url,
              thumbnail_url: latestData.thumbnail_url,
              slug: latestData.slug,
              created_at: latestData.created_at
            });
          } else {
            setPost({
              id: data.id,
              title: data.title,
              description: data.excerpt || '',
              excerpt: data.excerpt,
              image_url: data.thumbnail_url,
              thumbnail_url: data.thumbnail_url,
              slug: data.slug,
              created_at: data.created_at
            });
          }
        }
      } catch (error) {
        console.error('Error loading featured post:', error);
        // Fallback content
        setPost({
          id: 'fallback-post',
          title: 'Voron 2.4 Build',
          description: 'CoreXY precision printer with full enclosure and extensive hardware control. The ultimate DIY 3D printing experience with unmatched precision and speed.',
          image_url: '/images/placeholder-1.jpg',
          slug: 'voron-24',
          created_at: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadFeaturedPost();
  }, [layout.featured_override]);

  if (isLoading) {
    return (
      <section className={cn("py-16 container mx-auto", className)}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Build</h2>
          <div className="h-2 w-40 bg-primary/20 mx-auto rounded animate-pulse"></div>
        </div>
        <div className="h-80 bg-muted/40 rounded-lg animate-pulse"></div>
      </section>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <section className={cn("py-16 container mx-auto", className)}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Featured Build</h2>
        <p className="text-muted-foreground">Check out this amazing community project</p>
      </div>

      <Card className="overflow-hidden border border-primary/10 bg-card shadow-xl shadow-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-72 md:h-auto overflow-hidden">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image_url})` }}
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
            <p className="text-muted-foreground mb-6">{post.description}</p>
            <a 
              href={`/builds/${post.slug}`}
              className={cn(
                "mt-auto px-6 py-2.5 rounded bg-primary text-primary-foreground inline-flex items-center justify-center",
                "hover:bg-primary/90 transition-colors w-full md:w-auto"
              )}
            >
              View Build Details
            </a>
          </div>
        </div>
      </Card>
    </section>
  );
}
