
import React from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { isDraggingAtom, dropIndicatorPositionAtom, dragSourceIdAtom } from '@/admin/atoms/tools.atoms';
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
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        position: 'fixed',
        left: dropPosition.x + 15,
        top: dropPosition.y + 15,
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0, 240, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
        padding: '6px 12px',
        borderRadius: '6px',
      }}
    >
      {draggedItem?.icon}
      <span className="text-[var(--impulse-text-primary)] text-sm whitespace-nowrap">
        {draggedItem?.label}
      </span>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-md opacity-75"
        animate={{
          boxShadow: [
            '0 0 5px rgba(0, 240, 255, 0.3)',
            '0 0 15px rgba(0, 240, 255, 0.7)',
            '0 0 5px rgba(0, 240, 255, 0.3)'
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
}
