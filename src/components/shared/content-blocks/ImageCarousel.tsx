import React from 'react';
import { Card } from '@/components/ui/card';

export interface ImageCarouselProps {
  images: string[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  onImageClick?: (index: number) => void;
  className?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  currentIndex = 0,
  onIndexChange,
  onImageClick,
  className = ''
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className="w-48 h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              onImageClick?.(index);
              onIndexChange?.(index);
            }}
          />
        ))}
      </div>
    </Card>
  );
};

export default ImageCarousel;