import React from 'react';
import { motion } from 'framer-motion';

interface ImageThumbnailsProps {
  images: string[];
  onImageClick: (index: number) => void;
}

const ImageThumbnails: React.FC<ImageThumbnailsProps> = ({ images, onImageClick }) => {
  console.log('Rendering ImageThumbnails with images:', images); // Debug log
  
  return (
    <div className="grid grid-cols-5 gap-2 w-full">
      {images.slice(0, 5).map((image, index) => (
        <motion.div 
          key={index} 
          className="relative aspect-square overflow-hidden rounded-lg border border-[#ff0abe]/20 shadow-lg shadow-[#ff0abe]/10 cursor-pointer bg-black/40"
          whileHover={{ y: -5, scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            console.log('Thumbnail clicked:', index, image); // Debug log
            onImageClick(index);
          }}
        >
          <motion.div
            className="absolute inset-0 bg-[#ff0abe]/20 mix-blend-overlay"
            whileHover={{ opacity: 0 }}
          />
          <img 
            src={image} 
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ImageThumbnails;