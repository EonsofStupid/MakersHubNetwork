
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

interface FeaturedPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  thumbnail_url: string;
}

interface FeaturedSectionProps {
  post?: {
    id?: string | null;
    title?: string | null;
    excerpt?: string | null;
    slug?: string | null;
    thumbnail_url?: string | null;
  } | null;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ post }) => {
  // Replace the code that's causing issues with string | null vs string | undefined
  const featuredPost: FeaturedPost = {
    id: post?.id || '',
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    slug: post?.slug || '',
    thumbnail_url: post?.thumbnail_url || ''
  };

  return (
    <section className="my-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Featured Post</h2>
        
        <Card className="overflow-hidden">
          {featuredPost.thumbnail_url && (
            <div className="h-48 w-full overflow-hidden">
              <img 
                src={featuredPost.thumbnail_url} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <CardHeader>
            <CardTitle>{featuredPost.title || 'Featured Post'}</CardTitle>
            <CardDescription>{featuredPost.excerpt}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="line-clamp-3">{featuredPost.excerpt}</p>
          </CardContent>
          
          <CardFooter>
            <Button variant="default">Read More</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default FeaturedSection;
