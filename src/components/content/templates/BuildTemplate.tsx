import React from 'react';
import { motion } from 'framer-motion';

const BuildTemplate = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Build template content will go here */}
    </motion.div>
  );
};

export default BuildTemplate;