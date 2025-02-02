import React from 'react';
import { motion } from 'framer-motion';

const GuideTemplate = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Guide template content will go here */}
    </motion.div>
  );
};

export default GuideTemplate;