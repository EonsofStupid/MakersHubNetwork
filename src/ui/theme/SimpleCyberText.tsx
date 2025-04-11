
import React from 'react';
import { motion } from 'framer-motion';

interface SimpleCyberTextProps {
  text: string;
  className?: string;
  glitch?: boolean;
}

export function SimpleCyberText({ text, className = '', glitch = false }: SimpleCyberTextProps) {
  const letters = text.split('');

  if (glitch) {
    return (
      <motion.span 
        className={`inline-block relative ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="inline-block"
            style={{ 
              textShadow: '0 0 2px rgba(0, 240, 255, 0.5), 0 0 5px rgba(0, 240, 255, 0.3)'
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  return (
    <span className={className} style={{ 
      textShadow: '0 0 2px rgba(0, 240, 255, 0.5), 0 0 5px rgba(0, 240, 255, 0.3)'
    }}>
      {text}
    </span>
  );
}
