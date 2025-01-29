import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOverflowDetection } from "./hooks";
import { throttle } from "./utils";
import { useResponsiveLayout } from "./hooks";

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
}: AdaptivePopupProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { isOverflowing } = useOverflowDetection(contentRef);
  const { containerClass, isCompact } = useResponsiveLayout();

  useEffect(() => {
    const handleResize = throttle(() => {
      if (!contentRef.current) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const rect = contentRef.current.getBoundingClientRect();
      if (rect.height > vh * 0.85) contentRef.current.style.height = `${vh * 0.85}px`;
      if (rect.width > vw * 0.9) contentRef.current.style.width = `${vw * 0.9}px`;
    }, 200);

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        ref={contentRef}
        className={cn("p-0 border-primary/20 shadow-lg", className)}
        style={{ maxWidth: fullScreen ? "100vw" : maxWidth, maxHeight: fullScreen ? "100vh" : maxHeight }}
      >
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            {(title || showCloseButton) && (
              <div className="flex justify-between p-4 border-b">
                {title && <h2 className="text-lg font-bold">{title}</h2>}
                {showCloseButton && (
                  <Button variant="ghost" size="icon" onClick={() => onOpenChange?.(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            <ScrollArea className={cn("flex-1", contentClassName, preventScroll && "overflow-hidden")}>
              <div className="p-4">{children}</div>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
