
import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { Card } from '@/shared/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  thumbnail_url?: string;
  slug: string;
  created_at: string;
}

interface PostsSectionProps {
  className?: string;
  limit?: number;
}

export function PostsSection({ className, limit = 3 }: PostsSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt, thumbnail_url, slug, created_at')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) throw error;
        setPosts(data as BlogPost[]);
      } catch (error) {
        console.error('Error loading posts:', error);
        // Fallback content
        setPosts([
          {
            id: '1',
            title: 'Voron 2.4 Build',
            excerpt: 'CoreXY precision printer with full enclosure and extensive hardware control.',
            thumbnail_url: '/images/placeholder-1.jpg',
            slug: 'voron-24-build',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Ender 3 Modifications',
            excerpt: 'Upgraded firmware and custom parts for enhanced printing.',
            thumbnail_url: '/images/placeholder-2.jpg',
            slug: 'ender-3-mods',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Custom Resin Printer',
            excerpt: 'DIY SLA printer with 4K resolution for detailed prints.',
            thumbnail_url: '/images/placeholder-3.jpg',
            slug: 'diy-resin',
            created_at: new Date().toISOString()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPosts();
  }, [limit]);

  if (isLoading) {
    return (
      <section className={cn("py-16 px-4 container mx-auto", className)}>
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-muted/40 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-16 px-4 container mx-auto", className)}>
      <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <Card 
            key={post.id}
            className="overflow-hidden flex flex-col border border-primary/10 bg-card hover:shadow-lg hover:shadow-primary/5 transition-shadow"
          >
            {post.thumbnail_url && (
              <div className="h-48 overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center transform hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${post.thumbnail_url})` }}
                />
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              {post.excerpt && (
                <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
              )}
              <a 
                href={`/posts/${post.slug}`}
                className="mt-auto px-4 py-2 bg-primary/10 text-primary text-center rounded hover:bg-primary/20 transition-colors"
              >
                Read More
              </a>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <a 
          href="/blog"
          className="inline-flex items-center justify-center px-6 py-2 border border-primary/30 rounded-full text-primary hover:bg-primary/10 transition-colors"
        >
          View All Posts
        </a>
      </div>
    </section>
  );
}
