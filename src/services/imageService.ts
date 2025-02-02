export * from './image-handling/validation';
export * from './image-handling/upload';
export * from './image-handling/types';

import { validateImageInMediaTable, validateImageInStorage } from './image-handling/validation';
import { ImageValidationResult } from './image-handling/types';

export const validateBlogImage = async (imageUrl: string): Promise<boolean> => {
  try {
    console.log('Starting validation for image:', imageUrl);

    if (!imageUrl) {
      console.log('No image URL provided');
      return false;
    }

    // First check media table
    const mediaResult = await validateImageInMediaTable(imageUrl);
    if (mediaResult.isValid) {
      console.log('Image validated in media table');
      return true;
    }

    if (mediaResult.error) {
      console.error('Media table validation error:', mediaResult.error);
    }

    // Then check storage
    const storageResult = await validateImageInStorage(imageUrl);
    if (storageResult.isValid) {
      console.log('Image validated in storage');
      return true;
    }

    if (storageResult.error) {
      console.error('Storage validation error:', storageResult.error);
    }

    console.log('Image validation failed');
    return false;
  } catch (error) {
    console.error('Image validation error:', error);
    return false;
  }
};