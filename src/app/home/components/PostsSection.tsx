
import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  slug: string;
  created_at: string;
  author: {
    name: string;
    avatar_url?: string;
  };
}

interface PostsSectionProps {
  className?: string;
}

export function PostsSection({ className }: PostsSectionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            description,
            image_url,
            slug,
            created_at,
            author:profiles(name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        setPosts(data as Post[]);
      } catch (error) {
        console.error('Error loading posts:', error);
        // Fallback content
        setPosts([
          {
            id: '1',
            title: 'Voron 2.4 Build',
            description: 'CoreXY precision printer with full enclosure',
            image_url: '/images/placeholder-1.jpg',
            slug: 'voron-24',
            created_at: new Date().toISOString(),
            author: { name: 'Demo User' }
          },
          {
            id: '2',
            title: 'Ender 3 Modifications',
            description: 'Upgraded firmware and custom parts',
            image_url: '/images/placeholder-2.jpg',
            slug: 'ender-3-mods',
            created_at: new Date().toISOString(),
            author: { name: 'Demo User' }
          },
          {
            id: '3',
            title: 'Custom Resin Printer',
            description: 'DIY SLA printer with 4K resolution',
            image_url: '/images/placeholder-3.jpg',
            slug: 'diy-resin',
            created_at: new Date().toISOString(),
            author: { name: 'Demo User' }
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPosts();
  }, []);

  if (isLoading) {
    return (
      <section className={cn("py-16 container mx-auto", className)}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Latest Posts</h2>
          <div className="h-2 w-40 bg-primary/20 mx-auto rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-muted/40 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 container mx-auto", className)}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Latest Posts</h2>
        <p className="text-muted-foreground">Check out recent community content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <a 
            key={post.id}
            href={`/posts/${post.slug}`}
            className="block overflow-hidden rounded-lg border border-primary/10 bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 group relative"
          >
            <div className="h-48 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url(${post.image_url})` }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{post.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.author.name}</span>
                <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-all duration-300" />
          </a>
        ))}
      </div>
    </section>
  );
}
