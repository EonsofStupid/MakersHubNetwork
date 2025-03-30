
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminTooltip } from '../ui/AdminTooltip';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';

interface TopNavItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
  className?: string;
}

export function TopNavItem({
  id,
  icon,
  label,
  onClick,
  onRemove,
  isEditMode = false,
  className
}: TopNavItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Make the item draggable for reordering
  const { makeDraggable } = useDragAndDrop({
    items: [id],
    containerId: 'top-nav-shortcuts',
    dragOnlyInEditMode: true
  });
  
  // Set up drag functionality
  useEffect(() => {
    if (itemRef.current && isEditMode) {
      return makeDraggable(itemRef.current, id);
    }
  }, [id, isEditMode, makeDraggable]);

  // Create color variant based on ID for visual variety
  const getColorClass = () => {
    // Create a simple hash from the id
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get a value between 0 and 3
    const colorIndex = Math.abs(hash) % 4;
    
    const glows = [
      "group-hover:shadow-[0_0_10px_rgba(0,240,255,0.7)]", // Cyan
      "group-hover:shadow-[0_0_10px_rgba(255,0,128,0.7)]", // Pink
      "group-hover:shadow-[0_0_10px_rgba(0,255,128,0.7)]", // Green
      "group-hover:shadow-[0_0_10px_rgba(255,128,0,0.7)]", // Orange
    ];
    
    return glows[colorIndex];
  };

  return (
    <AdminTooltip content={label} side="bottom">
      <motion.div
        ref={itemRef}
        data-id={id}
        className="relative group"
      >
        <motion.button
          layoutId={`topnav-${id}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className={cn(
            "admin-topnav-item p-2 rounded-full",
            "bg-[var(--impulse-bg-card)]",
            "text-[var(--impulse-text-primary)]",
            "hover:bg-[var(--impulse-primary)]/20",
            "hover:text-[var(--impulse-primary)]",
            "transition-all",
            getColorClass(),
            className
          )}
        >
          <motion.div 
            className="relative z-10"
            animate={{ 
              rotate: isEditMode ? [0, -5, 5, 0] : 0,
            }}
            transition={{ 
              duration: 2, 
              repeat: isEditMode ? Infinity : 0,
              repeatType: "reverse" 
            }}
          >
            {icon}
          </motion.div>
          
          {/* Glow overlay effect */}
          <motion.div 
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{
              boxShadow: isEditMode 
                ? ["0 0 0px rgba(0, 240, 255, 0)", "0 0 10px rgba(0, 240, 255, 0.5)", "0 0 0px rgba(0, 240, 255, 0)"] 
                : "none"
            }}
            transition={{ 
              duration: 2, 
              repeat: isEditMode ? Infinity : 0 
            }}
          />
        </motion.button>
        
        {/* Removal button that appears in edit mode */}
        {isEditMode && onRemove && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
            onClick={onRemove}
          >
            <X className="w-3 h-3" />
          </motion.button>
        )}
      </motion.div>
    </AdminTooltip>
  );
}
