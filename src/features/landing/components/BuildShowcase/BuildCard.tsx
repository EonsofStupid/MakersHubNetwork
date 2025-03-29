
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BuildItemProps } from '../../types';

export const BuildCard: React.FC<BuildItemProps> = ({ build }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="build-card"
    >
      <div className="build-card-image-container">
        <img 
          src={build.imageUrl} 
          alt={build.title} 
          className="build-card-image"
        />
        <div className="build-card-gradient-overlay"></div>
        <div className="absolute bottom-2 left-2">
          <span className="build-card-category">
            {build.category}
          </span>
        </div>
      </div>
      
      <div className="build-card-content">
        <h3 className="build-card-title">{build.title}</h3>
        <p className="build-card-creator">by {build.creator}</p>
        
        <div className="build-card-stats">
          <span>{build.likes} likes</span>
          <span>{build.views} views</span>
        </div>
      </div>
    </motion.div>
  );
};
