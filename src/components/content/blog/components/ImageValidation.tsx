import React, { useEffect, useState } from 'react';
import { validateBlogImage } from '@/services/imageService';
import { toast } from "sonner";

interface ImageValidationProps {
  images: string[];
  onValidImagesChange: (validImages: string[]) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

export const ImageValidation: React.FC<ImageValidationProps> = ({
  images,
  onValidImagesChange,
  onLoadingChange
}) => {
  useEffect(() => {
    let isMounted = true;
    console.log('ImageValidation useEffect triggered with images:', images);

    const validateImages = async () => {
      if (!images.length) {
        console.log('No images to validate');
        if (isMounted) onLoadingChange(false);
        return;
      }

      try {
        console.log('Starting batch validation for images:', images);
        const validationResults = await Promise.all(
          images.map(async (imageUrl) => {
            if (!isMounted) return { imageUrl, isValid: false };
            const isValid = await validateBlogImage(imageUrl);
            console.log(`Validation result for ${imageUrl}:`, isValid);
            return { imageUrl, isValid };
          })
        );

        if (!isMounted) return;

        const validUrls = validationResults
          .filter(({ isValid }) => isValid)
          .map(({ imageUrl }) => imageUrl);

        console.log('Valid images:', validUrls);
        onValidImagesChange(validUrls);
      } catch (error) {
        console.error('Validation error:', error);
        if (isMounted) {
          toast.error('Failed to validate some images');
        }
      } finally {
        if (isMounted) {
          onLoadingChange(false);
        }
      }
    };

    validateImages();

    return () => {
      isMounted = false;
    };
  }, [images, onValidImagesChange, onLoadingChange]);

  return null;
};

export default ImageValidation;