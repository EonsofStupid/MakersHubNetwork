
import React, { useRef, useEffect } from 'react';
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
  const getCyberEffectClass = () => {
    // Create a simple hash from the id
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get a value between 0 and 3
    const effectIndex = Math.abs(hash) % 3;
    
    const effects = [
      "cyber-effect-1",
      "cyber-effect-2",
      "cyber-effect-3"
    ];
    
    return effects[effectIndex];
  };

  return (
    <motion.div
      ref={itemRef}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "glassmorphism relative overflow-hidden",
        "p-4 rounded-xl cursor-pointer",
        "min-h-[120px] flex flex-col justify-between",
        "cyber-glow",
        getCyberEffectClass(),
        editMode && "border-dashed border-primary/40 hover:border-primary",
        "transition-all duration-300"
      )}
      data-id={id}
    >
      {/* Cyber effect layer */}
      <div className="cyber-glitch-layer absolute inset-0 pointer-events-none" />
      
      {/* Icon */}
      <div className="flex-1 flex flex-col items-center justify-center mb-2">
        <motion.div
          className="text-[var(--impulse-text-accent)] text-3xl"
          animate={editMode ? {
            rotate: [0, -5, 5, 0],
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ 
            duration: 4, 
            repeat: editMode ? Infinity : 0,
            repeatType: "reverse" 
          }}
        >
          {icon}
        </motion.div>
      </div>
      
      {/* Title and description */}
      <div className="text-center">
        <h3 className="font-medium text-[var(--impulse-text-primary)]">{title}</h3>
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
    </motion.div>
  );
}
