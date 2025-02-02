import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface CyberpunkBlogViewerProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

const CyberpunkBlogViewer: React.FC<CyberpunkBlogViewerProps> = ({
  content,
  isOpen,
  onClose
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const paragraphs = content.split('\n').filter(p => p.trim());

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const scrollAmount = 100;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
        case ' ':
          setScrollPosition(prev => Math.min(prev + scrollAmount, contentRef.current?.scrollHeight || 0));
          break;
        case 'ArrowUp':
          setScrollPosition(prev => Math.max(prev - scrollAmount, 0));
          break;
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyPress);
      toast.info('Use arrow keys or spacebar to scroll');
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
      >
        <div className="relative w-full max-w-6xl h-[85vh] mx-4">
          <motion.button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 text-[#ff0abe] hover:text-white transition-colors group"
            whileHover={{ scale: 1.05 }}
          >
            <X className="w-6 h-6 group-hover:animate-pulse" />
            <span className="ml-2 text-sm animate-neon-glow">ESC to close</span>
          </motion.button>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full h-full rounded-lg border-4 border-[#ff0abe] shadow-[0_0_30px_rgba(255,10,190,0.3)] overflow-hidden"
            style={{
              background: 'linear-gradient(45deg, rgba(0,0,0,0.9), rgba(20,20,20,0.95))',
            }}
          >
            <div className="absolute inset-0 pointer-events-none animate-glitch opacity-30 mix-blend-overlay"
              style={{
                backgroundImage: 'url("/lovable-uploads/4edf410a-5bd3-426b-8efe-fb8acb60e39c.png")',
                backgroundSize: '400px',
                backgroundRepeat: 'repeat',
              }}
            />
            
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="w-full h-full bg-[linear-gradient(to_right,#ff0abe_1px,transparent_1px),linear-gradient(to_bottom,#ff0abe_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>
            
            <div 
              ref={contentRef}
              className="relative h-full overflow-hidden p-8"
            >
              <div 
                className="relative h-full space-y-6"
                style={{ transform: `translateY(-${scrollPosition}px)` }}
              >
                {paragraphs.map((paragraph, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div 
                      className="text-lg text-white/90 leading-relaxed prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                    <div className="absolute -left-4 top-0 w-0.5 h-full bg-gradient-to-b from-[#ff0abe] via-transparent to-transparent opacity-50" />
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <div className="px-6 py-3 bg-black/60 rounded-full border border-[#ff0abe]/30 shadow-[0_0_10px_rgba(255,10,190,0.2)]">
                <div className="flex items-center gap-4 text-[#ff0abe] text-sm animate-pulse">
                  <ChevronUp className="w-4 h-4" />
                  <span>↑↓ arrows or spacebar</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CyberpunkBlogViewer;