
import React, { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { adminDraggedItemAtom } from '@/admin/atoms/tools.atoms';
import { AdminTooltip } from '../ui/AdminTooltip';

interface NavItemProps {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
  showLabel?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  draggable?: boolean;
}

export function NavItem({
  id,
  icon: Icon,
  label,
  path,
  showLabel = true,
  isActive = false,
  onClick,
  draggable = false
}: NavItemProps) {
  const [, setDraggedItem] = useAtom(adminDraggedItemAtom);
  const itemRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  
  // Handle drag start using Framer Motion
  const handleDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggable) return;
    
    // Start the drag with framer motion
    dragControls.start(event);
    
    // Set state for the dragged item
    setDraggedItem({
      id,
      type: 'nav',
      data: { id, label, path, icon: Icon }
    });
  };
  
  return (
    <AdminTooltip
      content={!showLabel ? label : null}
      side="right"
      align="center"
    >
      <motion.div
        ref={itemRef}
        drag={draggable}
        dragControls={dragControls}
        onDragStart={() => {
          setDraggedItem({
            id,
            type: 'nav',
            data: { id, label, path, icon: Icon }
          });
        }}
        onDragEnd={() => {
          setDraggedItem(null);
        }}
        onPointerDown={handleDragStart}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "flex items-center rounded-md px-3 py-2 cursor-pointer",
          "transition-colors duration-150",
          isActive
            ? "bg-[var(--impulse-bg-active)] text-[var(--impulse-text-active)]"
            : "text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-bg-hover)]",
          draggable && "hover:border-dashed hover:border hover:border-[var(--impulse-border-hover)]"
        )}
        onClick={onClick}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {showLabel && (
          <span className="ml-3 truncate">{label}</span>
        )}
      </motion.div>
    </AdminTooltip>
  );
}
