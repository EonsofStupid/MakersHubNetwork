
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { AdminTooltip } from '../ui/AdminTooltip';

interface DashboardShortcutProps {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
}

export function DashboardShortcut({
  id,
  title,
  description,
  icon,
  onClick,
  onRemove,
  isEditMode = false
}: DashboardShortcutProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [editMode] = useAtom(adminEditModeAtom);
  const [randomizedEffect, setRandomizedEffect] = useState<string>('');
  const [hoverGlowColor, setHoverGlowColor] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  
  // Register for drag and drop
  const { makeDraggable } = useDragAndDrop({
    items: [id],
    containerId: 'dashboard-shortcuts',
    dragOnlyInEditMode: true
  });
  
  // Set up drag functionality
  useEffect(() => {
    if (itemRef.current && editMode) {
      return makeDraggable(itemRef.current, id);
    }
  }, [id, editMode, makeDraggable]);
  
  // Generate random cyber effects based on the item id
  useEffect(() => {
    // Create a simple hash from the id
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get a value between 0 and 4
    const effectIndex = Math.abs(hash) % 5;
    
    const effects = [
      "cyber-effect-1",
      "cyber-effect-2",
      "cyber-effect-3",
      "cyber-effect-4",
      "cyber-effect-5"
    ];
    
    setRandomizedEffect(effects[effectIndex]);
  }, [id]);
  
  // Generate a random glow color on hover
  const getRandomGlowColor = () => {
    const colors = [
      "0 0 20px rgba(0, 240, 255, 0.7)",      // Cyan
      "0 0 20px rgba(255, 0, 128, 0.7)",      // Pink
      "0 0 20px rgba(0, 255, 128, 0.7)",      // Green
      "0 0 20px rgba(255, 128, 0, 0.7)",      // Orange
      "0 0 20px rgba(138, 43, 226, 0.7)",     // BlueViolet
      "0 0 20px rgba(255, 215, 0, 0.7)"       // Gold
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Event handler for mouse enter to randomize glow color
  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoverGlowColor(getRandomGlowColor());
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={itemRef}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "glassmorphism relative overflow-hidden",
        "p-4 rounded-xl cursor-pointer",
        "min-h-[120px] flex flex-col justify-between",
        "cyber-glow",
        randomizedEffect,
        editMode && "border-dashed border-primary/40 hover:border-primary",
        "transition-all duration-300"
      )}
      data-id={id}
      style={hoverGlowColor && isHovered ? {
        boxShadow: hoverGlowColor
      } : undefined}
    >
      {/* Cyber effect layer */}
      <div className="cyber-glitch-layer absolute inset-0 pointer-events-none" />
      
      {/* Icon */}
      <div className="flex-1 flex flex-col items-center justify-center mb-2">
        <motion.div
          className="text-[var(--impulse-text-accent)] text-3xl"
          animate={isHovered || editMode ? {
            rotate: [0, -5, 5, 0],
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ 
            duration: 4, 
            repeat: (isHovered || editMode) ? Infinity : 0,
            repeatType: "reverse" 
          }}
        >
          {icon}
        </motion.div>
      </div>
      
      {/* Title and description */}
      <div className="text-center">
        <motion.h3 
          className="font-medium text-[var(--impulse-text-primary)]"
          animate={isHovered ? { 
            textShadow: ["0 0 0px rgba(0,240,255,0)", "0 0 10px rgba(0,240,255,0.5)", "0 0 0px rgba(0,240,255,0)"] 
          } : {}}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        >
          {title}
        </motion.h3>
        {description && (
          <p className="text-xs text-[var(--impulse-text-secondary)]">{description}</p>
        )}
      </div>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-primary/5 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.2) 0%, transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 70%)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Cyberpunk angle cut corner */}
      <div className="absolute top-0 right-0 w-8 h-8" style={{
        clipPath: "polygon(100% 0, 100% 100%, 0 0)",
        background: "linear-gradient(135deg, var(--impulse-primary) 0%, transparent 80%)",
        opacity: 0.6
      }} />
      
      {/* Remove Button (only in edit mode) */}
      {editMode && onRemove && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
      
      {/* Drag handle indicator in edit mode */}
      {editMode && (
        <motion.div
          className="absolute inset-x-0 top-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-1 w-12 bg-primary/30 rounded-full mt-2" />
        </motion.div>
      )}
      
      {/* Cyber scanning line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered || editMode ? 1 : 0 }}
      >
        <motion.div
          className="h-[1px] w-full bg-primary/40"
          animate={{
            top: ["0%", "100%", "0%"]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute" }}
        />
      </motion.div>
    </motion.div>
  );
}
