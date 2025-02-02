import { supabase } from "@/integrations/supabase/client";
import { ImageUploadResult } from "./types";

export const uploadBlogImage = async (file: File, postId: string): Promise<ImageUploadResult> => {
  try {
    console.log('Starting image upload for post:', postId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blog/${postId}/${fileName}`;

    console.log('Uploading file:', { filePath, type: file.type });

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { url: '', error: 'Failed to upload image' };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    console.log('File uploaded, public URL:', publicUrl);

    // Create media record
    const { error: mediaError } = await supabase
      .from('media')
      .insert({
        name: fileName,
        url: publicUrl,
        type: file.type,
        size: file.size,
        blog_post_id: postId
      });

    if (mediaError) {
      console.error('Media record error:', mediaError);
      return { url: publicUrl, error: 'Failed to create media record' };
    }

    // Update blog post images array
    const { error: updateError } = await supabase
      .rpc('append_blog_image', {
        post_id: postId,
        image_url: publicUrl
      });

    if (updateError) {
      console.error('Blog post update error:', updateError);
      return { url: publicUrl, error: 'Image uploaded but failed to update post' };
    }

    return { url: publicUrl };
  } catch (error) {
    console.error('Image upload error:', error);
    return { url: '', error: 'Failed to process image upload' };
  }
};