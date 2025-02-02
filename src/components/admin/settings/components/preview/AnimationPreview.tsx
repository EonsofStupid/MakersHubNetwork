import React from "react";
import { motion } from "framer-motion";

interface AnimationPreviewProps {
  colors: {
    neon_cyan?: string;
    neon_pink?: string;
    neon_purple?: string;
  };
}

export const AnimationPreview: React.FC<AnimationPreviewProps> = ({ colors }) => {
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      key={`effects-${colors.neon_cyan}`}
    >
      <p className="text-sm text-gray-400">Animation Previews:</p>
      <div className="space-y-2">
        <p className="animate-neon-pulse" style={{ color: colors.neon_cyan }}>
          Neon Pulse Effect
        </p>
        <p className="animate-neon-glow" style={{ color: colors.neon_pink }}>
          Neon Glow Effect
        </p>
        <p className="animate-gradient-text" style={{ 
          backgroundImage: `linear-gradient(-45deg, ${colors.neon_cyan}, ${colors.neon_pink}, ${colors.neon_purple})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 200%'
        }}>
          Gradient Text Effect
        </p>
      </div>
    </motion.div>
  );
};