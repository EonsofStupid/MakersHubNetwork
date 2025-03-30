
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdminTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  delay?: number;
}

export function AdminTooltip({
  children,
  content,
  side = 'top',
  className = '',
  delay = 500
}: AdminTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const showTooltip = () => {
    setShouldRender(true);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };
  
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), 200);
  };
  
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Position styles based on side
  const getPositionStyles = () => {
    switch (side) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };
  
  // Arrow position styles
  const getArrowStyles = () => {
    switch (side) {
      case 'top':
        return 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-[var(--impulse-primary)] border-l-transparent border-r-transparent border-b-transparent';
      case 'right':
        return 'left-[-4px] top-1/2 -translate-y-1/2 border-r-[var(--impulse-primary)] border-t-transparent border-b-transparent border-l-transparent';
      case 'bottom':
        return 'top-[-4px] left-1/2 -translate-x-1/2 border-b-[var(--impulse-primary)] border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'right-[-4px] top-1/2 -translate-y-1/2 border-l-[var(--impulse-primary)] border-t-transparent border-b-transparent border-r-transparent';
      default:
        return 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-[var(--impulse-primary)] border-l-transparent border-r-transparent border-b-transparent';
    }
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {shouldRender && (
          <motion.div
            className={cn(
              "absolute z-50 whitespace-nowrap max-w-xs",
              getPositionStyles()
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className={cn(
                "rounded-md px-3 py-1.5 text-xs",
                "bg-[var(--impulse-bg-card)] backdrop-blur-md",
                "border border-[var(--impulse-border-normal)]",
                "text-[var(--impulse-text-primary)]",
                "shadow-lg",
                className
              )}
            >
              {content}
            </div>
            
            {/* Arrow */}
            <div 
              className={cn(
                "absolute w-0 h-0",
                "border-solid border-4",
                getArrowStyles()
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
