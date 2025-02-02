import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Post {
  id: string;
  title: string;
  content: string;
  status: string | null;
  updated_at: string | null;
  views_count: number | null;
  author_id: string | null;
}

export interface PostWithAuthor extends Post {
  profiles: {
    display_name: string | null;
    username: string | null;
  };
}

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      console.log('Starting posts fetch operation...');
      
      try {
        console.log('Executing Supabase query with profiles join...');
        const { data: rawData, error: rawError } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles (
              display_name,
              username
            )
          `)
          .order('updated_at', { ascending: false });

        console.log('Raw Supabase Response:', { data: rawData, error: rawError });

        if (rawError) {
          console.error('Error in Supabase query:', rawError);
          toast.error('Failed to load posts');
          throw rawError;
        }

        if (!rawData) {
          console.warn('No data returned from Supabase');
          return [];
        }

        // Transform the data
        console.log('Transforming posts data...');
        const transformedData: PostWithAuthor[] = rawData.map(post => {
          // Log each post's profile data for debugging
          console.log('Post profile data:', {
            postId: post.id,
            profiles: post.profiles,
            authorId: post.author_id
          });

          return {
            ...post,
            profiles: post.profiles || {
              display_name: null,
              username: null
            }
          };
        });

        console.log('Successfully transformed posts:', transformedData);
        return transformedData;
      } catch (error) {
        console.error('Unexpected error in posts query:', error);
        throw error;
      }
    },
  });
};