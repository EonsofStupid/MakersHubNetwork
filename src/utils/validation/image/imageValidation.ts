import { supabase } from "@/integrations/supabase/client";

export const ACCEPTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif'
];

export const validateImageFile = (file: File): boolean => {
  return ACCEPTED_IMAGE_FORMATS.includes(file.type);
};

export const validateBlogImage = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl) {
      console.log('No image URL provided');
      return false;
    }

    // Simple URL validation first
    if (!imageUrl.includes('storage/v1/object/public/')) {
      console.log('Invalid storage URL format:', imageUrl);
      return false;
    }

    // Get bucket and path
    const parts = imageUrl.split('storage/v1/object/public/')[1];
    if (!parts) {
      console.log('Could not extract bucket and path from URL:', imageUrl);
      return false;
    }

    const [bucket, ...pathParts] = parts.split('/');
    const path = pathParts.join('/');

    console.log('Checking image in bucket:', bucket, 'path:', path);

    // List files in the path to verify existence
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .list(path.split('/').slice(0, -1).join('/'), {
        limit: 1,
        offset: 0,
        search: path.split('/').pop()
      });

    if (error) {
      console.error('Storage list error:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error validating blog image:', error);
    return false;
  }
};

export const validateImageCount = (currentCount: number, maxCount: number = 7): boolean => {
  return currentCount < maxCount;
};