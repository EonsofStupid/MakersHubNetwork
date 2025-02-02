import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextRevealProps {
  content: string;
}

const AnimatedTextReveal: React.FC<AnimatedTextRevealProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.2"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], [4, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);

  return (
    <div ref={containerRef} className="relative min-h-[200px]">
      <motion.div
        style={{
          opacity,
          filter: blur.get() > 0 ? `blur(${blur.get()}px)` : undefined,
          scale,
        }}
        className="prose prose-invert max-w-none transition-all duration-300"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default AnimatedTextReveal;