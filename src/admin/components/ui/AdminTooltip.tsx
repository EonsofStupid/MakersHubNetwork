
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHover } from '@/hooks/use-hover';
import { cn } from '@/lib/utils';

interface AdminTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delay?: number;
  className?: string;
}

export function AdminTooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delay = 300,
  className
}: AdminTooltipProps) {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>(delay);
  const [ready, setReady] = useState(false);
  
  // Position the tooltip based on the side prop
  const getTooltipPosition = () => {
    switch (side) {
      case 'top':
        return { bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' };
      case 'right':
        return { left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)' };
      case 'bottom':
        return { top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { right: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)' };
      default:
        return {};
    }
  };
  
  // Position the arrow based on the side prop
  const getArrowPosition = () => {
    switch (side) {
      case 'top':
        return { bottom: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' };
      case 'right':
        return { left: '-5px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' };
      case 'bottom':
        return { top: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' };
      case 'left':
        return { right: '-5px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' };
      default:
        return {};
    }
  };
  
  // Adjust alignment based on the align prop
  const getAlignmentStyle = () => {
    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          return { transform: 'translateX(0)', left: '0' };
        case 'end':
          return { transform: 'translateX(0)', right: '0' };
        default:
          return {};
      }
    } else if (side === 'left' || side === 'right') {
      switch (align) {
        case 'start':
          return { transform: 'translateY(0)', top: '0' };
        case 'end':
          return { transform: 'translateY(0)', bottom: '0' };
        default:
          return {};
      }
    }
    
    return {};
  };
  
  return (
    <div
      ref={hoverRef}
      className="relative inline-block"
      onMouseEnter={() => setReady(true)}
    >
      {children}
      
      <AnimatePresence>
        {ready && isHovered && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              "absolute z-50 px-3 py-1.5 text-xs rounded-md",
              "bg-[var(--impulse-bg-card)] backdrop-blur-md",
              "text-[var(--impulse-text-primary)]",
              "border border-[var(--impulse-border-normal)]",
              "whitespace-nowrap",
              "shadow-md",
              className
            )}
            style={{
              ...getTooltipPosition(),
              ...getAlignmentStyle()
            }}
          >
            {content}
            
            {/* Arrow */}
            <motion.div
              className="absolute w-2 h-2 bg-[var(--impulse-bg-card)] border-[var(--impulse-border-normal)]"
              style={{
                ...getArrowPosition(),
                borderWidth: '0 1px 1px 0',
                borderStyle: 'solid',
                borderColor: 'inherit',
              }}
            />
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-md -z-10"
              animate={{
                boxShadow: [
                  '0 0 5px rgba(0, 240, 255, 0.1)',
                  '0 0 8px rgba(0, 240, 255, 0.2)',
                  '0 0 5px rgba(0, 240, 255, 0.1)'
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
