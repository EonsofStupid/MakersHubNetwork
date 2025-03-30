
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHover } from '@/hooks/use-hover';

interface AdminTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delay?: number;
}

export function AdminTooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 300,
}: AdminTooltipProps) {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>(delay);
  
  // Calculate the position based on side and align
  const getPosition = () => {
    const positions = {
      top: { y: -10, x: 0, originY: 1 },
      right: { x: 10, y: 0, originX: 0 },
      bottom: { y: 10, x: 0, originY: 0 },
      left: { x: -10, y: 0, originX: 1 }
    };
    
    const alignments = {
      start: { align: 'flex-start' },
      center: { align: 'center' },
      end: { align: 'flex-end' }
    };
    
    return {
      ...positions[side],
      ...alignments[align]
    };
  };
  
  const position = getPosition();
  
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: side === 'top' ? -5 : side === 'bottom' ? 5 : 0,
      x: side === 'left' ? -5 : side === 'right' ? 5 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: side === 'top' ? -10 : side === 'bottom' ? 10 : 0,
      x: side === 'left' ? -10 : side === 'right' ? 10 : 0,
    }
  };

  return (
    <div ref={hoverRef} className="relative inline-flex">
      {children}
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.2 }}
            style={{
              transformOrigin: `${position.originX || 0.5} ${position.originY || 0.5}`,
            }}
            className={`absolute z-50 px-2 py-1 text-xs rounded-md bg-[var(--impulse-bg-overlay)] border border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)] shadow-lg backdrop-blur-sm whitespace-nowrap pointer-events-none
              ${side === 'top' ? 'bottom-full mb-1' : 
                side === 'bottom' ? 'top-full mt-1' :
                side === 'left' ? 'right-full mr-1' : 'left-full ml-1'}
              ${align === 'start' ? 'left-0' : 
                align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'}
            `}
          >
            <div className="relative z-10">
              {content}
            </div>
            
            {/* Glass effect and highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-md pointer-events-none" />
            <div className="absolute inset-0 border-t border-l border-white/10 rounded-md pointer-events-none" />
            
            {/* Arrow/caret */}
            <div 
              className={`absolute w-2 h-2 bg-[var(--impulse-bg-overlay)] border border-[var(--impulse-border-normal)] transform rotate-45
                ${side === 'top' ? 'top-full -translate-y-1/2 border-r border-b' : 
                  side === 'bottom' ? 'bottom-full translate-y-1/2 border-l border-t' :
                  side === 'left' ? 'left-full -translate-x-1/2 border-t border-r' : 
                  'right-full translate-x-1/2 border-b border-l'}
                ${align === 'start' ? 'left-3' : 
                  align === 'end' ? 'right-3' : 'left-1/2 -translate-x-1/2'}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
