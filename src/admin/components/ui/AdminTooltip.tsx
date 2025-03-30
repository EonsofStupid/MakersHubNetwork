
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from '@/components/ui/portal';
import { cn } from '@/lib/utils';

interface AdminTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delay?: number;
  className?: string;
}

export function AdminTooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 300,
  className
}: AdminTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (side) {
      case 'top':
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case 'right':
        x = triggerRect.right + 8;
        break;
      case 'bottom':
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        break;
    }

    switch (align) {
      case 'start':
        if (side === 'top' || side === 'bottom') {
          x = triggerRect.left;
        } else {
          y = triggerRect.top;
        }
        break;
      case 'center':
        if (side === 'top' || side === 'bottom') {
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        } else {
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        }
        break;
      case 'end':
        if (side === 'top' || side === 'bottom') {
          x = triggerRect.right - tooltipRect.width;
        } else {
          y = triggerRect.bottom - tooltipRect.height;
        }
        break;
    }

    // Ensure tooltip stays within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));

    setPosition({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible]);

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.1, ease: 'easeOut' }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <Portal>
            <motion.div
              ref={tooltipRef}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={variants}
              className={cn(
                'fixed z-50 max-w-xs pointer-events-none',
                'px-3 py-1.5 text-sm rounded',
                'bg-[var(--impulse-bg-overlay)] backdrop-blur-md',
                'border border-[var(--impulse-border-normal)]',
                'text-[var(--impulse-text-primary)]',
                'shadow-lg',
                className
              )}
              style={{
                left: position.x,
                top: position.y
              }}
            >
              {content}
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
}
