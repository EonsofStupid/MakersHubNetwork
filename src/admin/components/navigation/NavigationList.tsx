
import React, { ReactNode, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { scrollbarStyle } from '@/admin/utils/styles';

interface NavigationListProps {
  children: ReactNode;
  className?: string;
  containerId: string;
  items?: string[];
  onReorder?: (items: string[]) => void;
  expanded?: boolean;
}

export function NavigationList({ 
  children, 
  className, 
  containerId,
  items = [],
  onReorder,
  expanded = true 
}: NavigationListProps) {
  const [isEditMode] = useAtom(adminEditModeAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use the draggable hook
  const { registerDropZone, isDragging } = useDragAndDrop({
    items,
    onReorder,
    containerId,
    acceptExternalItems: false
  });

  // Register as drop zone if items and onReorder are provided
  useEffect(() => {
    if (containerRef.current && items.length > 0 && onReorder) {
      return registerDropZone(containerRef.current);
    }
  }, [registerDropZone, items, onReorder]);

  // Animation variants
  const listVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1 
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      variants={listVariants}
      initial="initial"
      animate="animate"
      data-container-id={containerId}
      className={cn(
        "admin-navigation-list flex-1 overflow-y-auto py-2",
        scrollbarStyle,
        isDragging && isEditMode && "bg-primary/5 ring-1 ring-primary/30",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
