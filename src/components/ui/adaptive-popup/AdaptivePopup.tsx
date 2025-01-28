import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAnimationStore } from "@/stores/animations/store";
import { ScrollArea } from "@/components/ui/scroll-area";

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
}: AdaptivePopupProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { timings } = useAnimationStore();

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const hasOverflow = 
          contentRef.current.scrollHeight > contentRef.current.clientHeight ||
          contentRef.current.scrollWidth > contentRef.current.clientWidth;
        setIsOverflowing(hasOverflow);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
      checkOverflow();
    }

    return () => resizeObserver.disconnect();
  }, [children]);

  const popupVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: timings.transitions.fast / 1000,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: timings.transitions.normal / 1000,
        ease: "easeOut",
      },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "p-0 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]",
          "backdrop-blur-xl bg-background/80",
          // Responsive classes
          "w-[95vw] sm:w-auto",
          "h-[90vh] sm:h-auto",
          className
        )}
        style={{
          maxWidth,
          maxHeight,
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={popupVariants}
          className="relative flex flex-col w-full h-full"
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-primary/20">
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
              "flex-1 p-4",
              isOverflowing && "overflow-auto",
              contentClassName
            )}
          >
            <div ref={contentRef}>{children}</div>
          </ScrollArea>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}