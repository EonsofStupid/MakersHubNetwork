
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdminTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function AdminTooltip({ 
  content, 
  children, 
  side = 'top',
  className
}: AdminTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  
  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsVisible(true);
    
    // Calculate position based on side
    if (tooltipRef.current) {
      const childRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let x = 0;
      let y = 0;
      
      switch (side) {
        case 'top':
          x = childRect.left + childRect.width / 2;
          y = childRect.top - 5;
          break;
        case 'right':
          x = childRect.right + 5;
          y = childRect.top + childRect.height / 2;
          break;
        case 'bottom':
          x = childRect.left + childRect.width / 2;
          y = childRect.bottom + 5;
          break;
        case 'left':
          x = childRect.left - 5;
          y = childRect.top + childRect.height / 2;
          break;
      }
      
      setPosition({ x, y });
    }
  };
  
  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  
  // Get transform origin based on side
  const getOrigin = () => {
    switch (side) {
      case 'top': return 'bottom center';
      case 'right': return 'left center';
      case 'bottom': return 'top center';
      case 'left': return 'right center';
    }
  };
  
  // Get styles based on side
  const getStyles = () => {
    const baseStyles = {
      position: 'fixed',
      zIndex: 999,
      transformOrigin: getOrigin(),
      pointerEvents: 'none',
    } as const;
    
    switch (side) {
      case 'top':
        return {
          ...baseStyles,
          bottom: `calc(100% - ${position.y}px)`,
          left: `${position.x}px`,
          transform: 'translateX(-50%) translateY(-5px)',
        };
      case 'right':
        return {
          ...baseStyles,
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translateY(-50%) translateX(5px)',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: `${position.y}px`,
          left: `${position.x}px`,
          transform: 'translateX(-50%) translateY(5px)',
        };
      case 'left':
        return {
          ...baseStyles,
          right: `calc(100% - ${position.x}px)`,
          top: `${position.y}px`,
          transform: 'translateY(-50%) translateX(-5px)',
        };
    }
  };

  return (
    <>
      {React.cloneElement(React.Children.only(children) as React.ReactElement, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      
      <AnimatePresence>
        {isVisible && (
          <div
            ref={tooltipRef}
            style={getStyles()}
            className="fixed z-[999]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20, stiffness: 400 }}
              className={cn(
                "px-2 py-1 rounded-md shadow-xl backdrop-blur-md",
                "bg-[var(--impulse-bg-overlay)] border border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)]",
                "text-xs whitespace-nowrap",
                className
              )}
            >
              {content}
              <div className={cn(
                "absolute w-2 h-2 rotate-45 bg-[var(--impulse-bg-overlay)] border",
                side === 'top' && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-t-0 border-l-0",
                side === 'right' && "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-t-0 border-r-0",
                side === 'bottom' && "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-b-0 border-r-0",
                side === 'left' && "right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-b-0 border-l-0",
              )}></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
