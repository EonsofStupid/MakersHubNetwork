
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { activePanelAtom, panelPositionAtom } from "@/admin/atoms/ui.atoms";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartOverlayProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number, y: number };
  width?: number;
  height?: number;
}

export function SmartOverlay({
  id,
  title,
  children,
  initialPosition = { x: 100, y: 100 },
  width = 320,
  height = 400
}: SmartOverlayProps) {
  const [activePanel, setActivePanel] = useAtom(activePanelAtom);
  const [position, setPosition] = useAtom(panelPositionAtom);
  const [isDragging, setIsDragging] = useState(false);
  
  const isActive = activePanel === id;
  
  // Initialize panel position
  useEffect(() => {
    if (isActive && !position.x && !position.y) {
      setPosition(initialPosition);
    }
  }, [isActive, initialPosition, position, setPosition]);
  
  // Close panel handler
  const handleClose = useCallback(() => {
    setActivePanel(null);
  }, [setActivePanel]);
  
  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive && e.key === "Escape") {
        handleClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, handleClose]);
  
  if (!isActive) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 20 }}
        style={{ 
          width: width,
          height: height,
          left: position.x,
          top: position.y
        }}
        drag
        dragConstraints={{ left: 0, right: window.innerWidth - width, top: 0, bottom: window.innerHeight - height }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onDrag={(_, info) => {
          setPosition({
            x: position.x + info.delta.x,
            y: position.y + info.delta.y
          });
        }}
        className={cn(
          "impulse-overlay fixed z-50", 
          "bg-[var(--impulse-bg-overlay)] backdrop-blur-lg", 
          "rounded-lg border border-[var(--impulse-border-normal)]", 
          "shadow-[var(--impulse-glow-primary)]",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {/* Overlay Header */}
        <div className={cn(
          "flex items-center justify-between px-4 py-2",
          "border-b border-[var(--impulse-border-normal)]",
          "bg-[rgba(0,240,255,0.1)]"
        )}>
          <h3 className="text-sm font-medium text-[var(--impulse-text-accent)]">
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-[rgba(255,255,255,0.1)]"
          >
            <X className="w-4 h-4 text-[var(--impulse-text-secondary)]" />
          </button>
        </div>
        
        {/* Overlay Content */}
        <div className="p-4 h-[calc(100%-3rem)] overflow-auto">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
