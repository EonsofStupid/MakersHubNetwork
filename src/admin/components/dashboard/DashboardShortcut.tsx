
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { useAdminStore } from '@/admin/store/admin.store';

interface DashboardShortcutProps {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
  className?: string;
}

// Variants for the animation
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    transition: { duration: 0.2 } 
  }
};

// Get a deterministic random number between 1-5 based on id
const getRandomColorClass = (id: string) => {
  const hash = id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return `color-${Math.abs(hash % 5) + 1}`;
};

// Get a deterministic cyber effect based on id
const getCyberEffect = (id: string) => {
  const hash = id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const effects = ["cyber-effect-1", "cyber-effect-2", "cyber-effect-3"];
  return effects[Math.abs(hash % effects.length)];
};

export function DashboardShortcut({
  id,
  title,
  description,
  icon: Icon,
  onClick,
  onRemove,
  isEditMode = false,
  className
}: DashboardShortcutProps) {
  const shortcutRef = useRef<HTMLDivElement>(null);
  const { dashboardShortcuts } = useAdminStore();
  
  // Set up drag and drop
  const { makeDraggable } = useDragAndDrop({
    items: dashboardShortcuts,
    containerId: 'dashboard-shortcuts',
    dragOnlyInEditMode: true
  });
  
  // Make the shortcut draggable in edit mode
  useEffect(() => {
    if (shortcutRef.current && isEditMode) {
      return makeDraggable(shortcutRef.current, id);
    }
  }, [id, isEditMode, makeDraggable]);
  
  // Get random effects based on id for visual variety
  const colorClass = getRandomColorClass(id);
  const cyberEffect = getCyberEffect(id);
  
  return (
    <motion.div
      ref={shortcutRef}
      variants={itemVariants}
      layout
      data-id={id}
      className={cn(
        "dashboard-shortcut group glassmorphism",
        "relative flex flex-col items-center text-center",
        "p-4 rounded-xl border border-[var(--impulse-border-normal)]",
        "transition-all duration-300 overflow-hidden",
        "hover:border-[var(--impulse-primary)]/70 focus:border-[var(--impulse-primary)]",
        isEditMode && "cursor-grab active:cursor-grabbing",
        colorClass,
        cyberEffect,
        className
      )}
      onClick={(e) => {
        if (!isEditMode) onClick();
      }}
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--impulse-primary)]/5 to-transparent" />
      </div>
      
      {/* Icon with glow effect */}
      <motion.div 
        className="w-12 h-12 mb-2 flex items-center justify-center relative"
        whileHover={{ scale: 1.05 }}
        animate={isEditMode ? { rotate: [0, -3, 3, 0] } : {}}
        transition={isEditMode ? { repeat: Infinity, duration: 5, repeatType: "mirror" } : {}}
      >
        <div className="absolute inset-0 bg-[var(--impulse-primary)]/10 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon className="w-7 h-7 text-[var(--impulse-primary)]" />
      </motion.div>
      
      {/* Title with hover effect */}
      <h3 className="text-sm font-medium mb-1 text-[var(--impulse-text-primary)] group-hover:text-[var(--impulse-primary)] transition-colors">
        {title}
      </h3>
      
      {/* Optional description */}
      {description && (
        <p className="text-xs text-[var(--impulse-text-secondary)] group-hover:text-[var(--impulse-text-primary)] transition-colors">
          {description}
        </p>
      )}
      
      {/* Remove button (only shown in edit mode) */}
      {isEditMode && onRemove && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg z-10"
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
      
      {/* Border animation for edit mode */}
      {isEditMode && (
        <motion.div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ 
            boxShadow: ["0 0 0 1px rgba(0, 240, 255, 0.3)", "0 0 0 2px rgba(0, 240, 255, 0.7)", "0 0 0 1px rgba(0, 240, 255, 0.3)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
