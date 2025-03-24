
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { hoveredComponentAtom, selectedComponentAtom } from "@/admin/store/atoms/overlay.atoms";
import { cn } from "@/lib/utils";

interface SmartOverlayProps {
  componentId: string;
  overlayContent: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  showArrow?: boolean;
  children: React.ReactNode;
}

export function SmartOverlay({
  componentId,
  overlayContent,
  position = "top",
  showArrow = true,
  children
}: SmartOverlayProps) {
  const [hoveredComponent, setHoveredComponent] = useAtom(hoveredComponentAtom);
  const [selectedComponent] = useAtom(selectedComponentAtom);
  const [overlayRect, setOverlayRect] = useState({ top: 0, left: 0 });
  const componentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isHovered = hoveredComponent === componentId;
  const isSelected = selectedComponent === componentId;
  const shouldShow = isHovered || isSelected;

  // Update overlay position based on component position
  useEffect(() => {
    if (shouldShow && componentRef.current && overlayRef.current) {
      const componentRect = componentRef.current.getBoundingClientRect();
      const overlayRect = overlayRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case "top":
          top = componentRect.top - overlayRect.height - 10;
          left = componentRect.left + (componentRect.width / 2) - (overlayRect.width / 2);
          break;
        case "bottom":
          top = componentRect.bottom + 10;
          left = componentRect.left + (componentRect.width / 2) - (overlayRect.width / 2);
          break;
        case "left":
          top = componentRect.top + (componentRect.height / 2) - (overlayRect.height / 2);
          left = componentRect.left - overlayRect.width - 10;
          break;
        case "right":
          top = componentRect.top + (componentRect.height / 2) - (overlayRect.height / 2);
          left = componentRect.right + 10;
          break;
      }
      
      // Ensure overlay stays within viewport
      if (left < 10) left = 10;
      if (left + overlayRect.width > window.innerWidth - 10) {
        left = window.innerWidth - overlayRect.width - 10;
      }
      
      if (top < 10) top = 10;
      if (top + overlayRect.height > window.innerHeight - 10) {
        top = window.innerHeight - overlayRect.height - 10;
      }
      
      setOverlayRect({ top, left });
    }
  }, [shouldShow, position, componentId]);

  const handleMouseEnter = () => {
    setHoveredComponent(componentId);
  };

  const handleMouseLeave = () => {
    setHoveredComponent(null);
  };

  // Arrow position based on overlay position
  const getArrowPosition = () => {
    switch (position) {
      case "top":
        return "bottom-[-8px] left-1/2 transform -translate-x-1/2 border-t-[8px] border-l-[8px] border-r-[8px] border-t-[var(--impulse-border-normal)] border-l-transparent border-r-transparent";
      case "bottom":
        return "top-[-8px] left-1/2 transform -translate-x-1/2 border-b-[8px] border-l-[8px] border-r-[8px] border-b-[var(--impulse-border-normal)] border-l-transparent border-r-transparent";
      case "left":
        return "right-[-8px] top-1/2 transform -translate-y-1/2 border-l-[8px] border-t-[8px] border-b-[8px] border-l-[var(--impulse-border-normal)] border-t-transparent border-b-transparent";
      case "right":
        return "left-[-8px] top-1/2 transform -translate-y-1/2 border-r-[8px] border-t-[8px] border-b-[8px] border-r-[var(--impulse-border-normal)] border-t-transparent border-b-transparent";
    }
  };

  return (
    <div
      ref={componentRef}
      data-component-id={componentId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {children}
      
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ 
              position: "fixed",
              top: overlayRect.top,
              left: overlayRect.left,
              zIndex: 9999
            }}
            className="impulse-overlay pointer-events-none"
          >
            <div className="impulse-panel p-2 min-w-[120px]">
              {overlayContent}
              
              {showArrow && (
                <div className={cn(
                  "absolute w-0 h-0",
                  getArrowPosition()
                )} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
