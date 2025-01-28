import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOverflowDetection } from "@/hooks/useOverflowDetection";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

interface AdaptivePopupProps {
  trigger?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
  maxWidth?: string;
  maxHeight?: string;
  showCloseButton?: boolean;
  preventScroll?: boolean;
  fullScreen?: boolean;
  preserveScrollBarGap?: boolean;
}

export function AdaptivePopup({
  trigger,
  title,
  children,
  open,
  onOpenChange,
  className,
  contentClassName,
  maxWidth = "90vw",
  maxHeight = "85vh",
  showCloseButton = true,
  preventScroll = false,
  fullScreen = false,
  preserveScrollBarGap = true,
}: AdaptivePopupProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isResizing, setIsResizing] = useState(false);
  
  // Custom hooks for responsive behavior
  const { isOverflowing, direction, ratio } = useOverflowDetection(contentRef, {
    threshold: 1.1,
    throttleMs: 100,
  });
  
  const { containerClass, isCompact } = useResponsiveLayout();

  // ResizeObserver for dynamic content
  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setIsResizing(true);
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setContentHeight(height);
      }
      // Debounce resize end
      setTimeout(() => setIsResizing(false), 100);
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Handle viewport changes
  useEffect(() => {
    if (!open) return;

    const handleResize = () => {
      if (contentRef.current) {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const rect = contentRef.current.getBoundingClientRect();
        
        // Adjust size based on viewport
        if (rect.height > vh * 0.85) {
          contentRef.current.style.height = `${vh * 0.85}px`;
        }
        if (rect.width > vw * 0.9) {
          contentRef.current.style.width = `${vw * 0.9}px`;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

  // Animation variants
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "p-0 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]",
          "backdrop-blur-xl bg-background/80",
          fullScreen ? "w-screen h-screen" : containerClass,
          isOverflowing && "overflow-hidden",
          className
        )}
        style={{
          maxWidth: fullScreen ? "100vw" : maxWidth,
          maxHeight: fullScreen ? "100vh" : maxHeight,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="relative flex flex-col w-full h-full"
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={cn(
                "flex items-center justify-between p-4",
                "border-b border-primary/20",
                isCompact ? "sticky top-0 z-10 backdrop-blur-md bg-background/50" : ""
              )}>
                {title && (
                  <h2 className="text-lg font-heading font-bold text-primary">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                    onClick={() => onOpenChange?.(false)}
                  >
                    <X className="h-4 w-4 text-primary" />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <ScrollArea
              className={cn(
                "flex-1",
                contentClassName,
                preventScroll && "overflow-hidden"
              )}
            >
              <div 
                ref={contentRef}
                className={cn(
                  "p-4",
                  isResizing && "transition-none",
                  isOverflowing && "space-y-4"
                )}
              >
                {children}
              </div>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}