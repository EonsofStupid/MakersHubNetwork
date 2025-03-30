
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { 
  isDraggingAtom, 
  dropIndicatorPositionAtom, 
  dragSourceIdAtom 
} from '@/admin/atoms/tools.atoms';
import { adminNavigationItems } from '@/admin/config/navigation.config';

export function DragIndicator() {
  const [isDragging] = useAtom(isDraggingAtom);
  const [dropPosition] = useAtom(dropIndicatorPositionAtom);
  const [dragSourceId] = useAtom(dragSourceIdAtom);
  
  if (!isDragging || !dropPosition || !dragSourceId) {
    return null;
  }
  
  // Find the icon for the dragged item
  const draggedItem = adminNavigationItems.find(item => item.id === dragSourceId);
  
  if (!draggedItem) return null;
  
  // Generate random color variant for each drag operation
  const getColorVariant = () => {
    const variants = [
      "bg-gradient-to-r from-blue-500/10 to-cyan-500/20 border-blue-500/30",
      "bg-gradient-to-r from-purple-500/10 to-pink-500/20 border-purple-500/30",
      "bg-gradient-to-r from-emerald-500/10 to-teal-500/20 border-emerald-500/30",
      "bg-gradient-to-r from-amber-500/10 to-orange-500/20 border-amber-500/30"
    ];
    
    // Create a simple hash from the dragSourceId
    let hash = 0;
    for (let i = 0; i < dragSourceId.length; i++) {
      hash = dragSourceId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return variants[Math.abs(hash) % variants.length];
  };
  
  // Get the Icon component from the item
  const Icon = draggedItem.icon;
  
  return (
    <AnimatePresence>
      <motion.div
        key="drag-indicator"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: dropPosition.x + 15,
          y: dropPosition.y + 15
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed pointer-events-none z-50 flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-md border backdrop-blur-md ${getColorVariant()}`}
      >
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[var(--impulse-text-primary)]">
          <Icon className="h-4 w-4" />
        </div>
        
        <span className="text-[var(--impulse-text-primary)] text-sm font-medium whitespace-nowrap">
          {draggedItem.label}
        </span>
        
        <motion.div
          className="absolute inset-0 rounded-md -z-10"
          animate={{
            boxShadow: [
              "0 0 5px rgba(0, 240, 255, 0.1)",
              "0 0 15px rgba(0, 240, 255, 0.3)",
              "0 0 5px rgba(0, 240, 255, 0.1)"
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
