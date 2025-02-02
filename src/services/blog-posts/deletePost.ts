import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeletePostResult {
  success: boolean;
  error?: string;
}

export const deletePost = async (postId: string): Promise<DeletePostResult> => {
  console.log('🗑️ Starting post deletion process:', { postId });
  
  try {
    // First, fetch the post to verify it exists and log details
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('title, images')
      .eq('id', postId)
      .single();

    if (fetchError) {
      console.error('Error fetching post for deletion:', fetchError);
      return { success: false, error: 'Failed to fetch post details' };
    }

    console.log('📝 Post found for deletion:', { 
      postId, 
      title: post?.title,
      imageCount: post?.images?.length 
    });

    // Delete associated media records first
    const { error: mediaError } = await supabase
      .from('media')
      .delete()
      .eq('blog_post_id', postId);

    if (mediaError) {
      console.error('Error deleting associated media:', { 
        postId, 
        error: mediaError 
      });
      return { success: false, error: 'Failed to delete associated media' };
    }

    console.log('🖼️ Successfully deleted associated media for post:', { postId });

    // Now delete the blog post
    const { error: postError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (postError) {
      console.error('Error deleting post:', { postId, error: postError });
      return { success: false, error: 'Failed to delete post' };
    }

    console.log('✅ Successfully deleted post and all associated media:', { 
      postId,
      title: post?.title 
    });

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in post deletion:', error);
    return { success: false, error: 'Unexpected error during deletion' };
  }
};