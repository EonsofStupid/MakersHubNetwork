import React from 'react';
import { motion } from 'framer-motion';
import ImageThumbnails from './ImageThumbnails';

interface ImageGalleryProps {
  images: string[];
  onImageClick: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <ImageThumbnails images={images} onImageClick={onImageClick} />
    </motion.div>
  );
};

export default ImageGallery;
export { ImageGallery };