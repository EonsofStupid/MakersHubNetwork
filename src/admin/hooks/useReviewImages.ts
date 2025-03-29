
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useReviewImages() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `review_images/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('review_images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('review_images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const deleteImage = async (url: string): Promise<boolean> => {
    setError(null);
    
    try {
      // Extract the file path from the URL
      const baseUrl = supabase.storage.from('review_images').getPublicUrl('').data.publicUrl;
      const filePath = url.replace(baseUrl, '');
      
      // Delete the file
      const { error: deleteError } = await supabase.storage
        .from('review_images')
        .remove([filePath]);
      
      if (deleteError) throw deleteError;
      
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete image';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };
  
  return {
    uploadImage,
    deleteImage,
    isUploading,
    error
  };
}
