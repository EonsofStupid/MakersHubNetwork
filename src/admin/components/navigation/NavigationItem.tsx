
import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';

interface NavigationItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function NavigationItem({
  id,
  icon,
  label,
  description,
  isActive = false,
  onClick,
  className
}: NavigationItemProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const { isEditMode, sidebarExpanded, setDragSource } = useAdminStore();

  // Handle drag start as a regular DOM event, not a Framer Motion event
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
    setDragSource(id);
    
    // Create drag image
    const dragImage = document.createElement('div');
    dragImage.innerHTML = `<div class="p-2 bg-[var(--impulse-bg-overlay)] border border-[var(--impulse-border-normal)] rounded-md flex items-center">
      <div class="mr-2">${typeof icon === 'string' ? icon : 'Icon'}</div>
      <span>${label}</span>
    </div>`;
    document.body.appendChild(dragImage);
    
    // Set custom drag image
    e.dataTransfer.setDragImage(dragImage, 20, 20);
    
    // Remove after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setTimeout(() => {
      setDragSource(null);
    }, 300);
  };

  return (
    <motion.div
      className={cn(
        'nav-item',
        isActive && 'active',
        isDragging && 'dragging',
        className
      )}
      draggable={isEditMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {isEditMode && (
        <motion.div 
          className="nav-item__drag-handle mr-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <GripVertical size={16} />
        </motion.div>
      )}
      
      <div className="nav-item__icon">
        {icon}
        
        <motion.div
          className="nav-item__icon-glow"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {sidebarExpanded && (
        <span className="nav-item__label">{label}</span>
      )}
      
      {!sidebarExpanded && (
        <AdminTooltip
          content={
            <div className="py-1">
              <div className="font-medium">{label}</div>
              {description && (
                <div className="text-xs opacity-70 mt-1">{description}</div>
              )}
            </div>
          }
          side="right"
        >
          <span className="sr-only">{label}</span>
        </AdminTooltip>
      )}
    </motion.div>
  );
}
