import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from '@/lib/store/auth-store';
import { uploadBlogImage } from '@/services/imageService';
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadHandlerProps {
  postId: string;
  onImageUploaded: (imageUrl: string) => void;
}

const ImageUploadHandler: React.FC<ImageUploadHandlerProps> = ({ postId, onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const { session } = useAuthStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!session?.user) {
        toast.error("You must be logged in to upload images");
        return;
      }

      setUploading(true);
      
      const { url, error } = await uploadBlogImage(file, postId);
      
      if (error || !url) {
        toast.error(error || 'Failed to upload image');
        return;
      }

      // Create media record
      const { error: mediaError } = await supabase
        .from('media')
        .insert({
          name: file.name,
          url: url,
          type: file.type,
          size: file.size,
          blog_post_id: postId,
          user_id: session.user.id
        });

      if (mediaError) {
        toast.error('Failed to save image metadata');
        return;
      }

      // Append to blog post images array
      const { error: appendError } = await supabase.rpc(
        'append_blog_image',
        { post_id: postId, image_url: url }
      );

      if (appendError) {
        toast.error('Failed to update blog post');
        return;
      }

      onImageUploaded(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        id="image-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      <label
        htmlFor="image-upload"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-[#41f0db]/30 
          bg-black/30 text-white cursor-pointer hover:bg-[#41f0db]/10 transition-all
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#41f0db] border-t-transparent" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 text-[#41f0db]" />
            Upload Image
          </>
        )}
      </label>
    </div>
  );
};

export default ImageUploadHandler;
