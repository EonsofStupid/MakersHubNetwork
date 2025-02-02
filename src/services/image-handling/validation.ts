import { supabase } from "@/integrations/supabase/client";
import { ImageValidationResult } from "./types";

export const validateImageInMediaTable = async (imageUrl: string): Promise<ImageValidationResult> => {
  console.log('Checking image in media table:', imageUrl);
  try {
    const { data, error } = await supabase
      .from('media')
      .select('id')
      .eq('url', imageUrl)
      .maybeSingle();

    if (error) {
      console.error('Media table check error:', error);
      return { isValid: false, error: error.message };
    }

    const isValid = !!data;
    console.log('Image found in media table:', isValid);
    return { isValid };
  } catch (error) {
    console.error('Media validation error:', error);
    return { isValid: false, error: 'Failed to check media table' };
  }
};

export const validateImageInStorage = async (imageUrl: string): Promise<ImageValidationResult> => {
  console.log('Checking image in storage:', imageUrl);
  try {
    const urlPattern = /storage\/v1\/object\/public\/([^/]+)\/(.+)/;
    const match = imageUrl.match(urlPattern);
    
    if (!match) {
      console.error('Invalid storage URL format:', imageUrl);
      return { isValid: false, error: 'Invalid storage URL format' };
    }

    const [, bucket, path] = match;
    console.log('Parsed storage path:', { bucket, path });

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path.split('/').slice(0, -1).join('/'), {
        limit: 1,
        search: path.split('/').pop()
      });

    if (error) {
      console.error('Storage check error:', error);
      return { isValid: false, error: error.message };
    }

    const isValid = data && data.length > 0;
    console.log('Image exists in storage:', isValid);
    return { isValid };
  } catch (error) {
    console.error('Storage validation error:', error);
    return { isValid: false, error: 'Failed to check storage' };
  }
};