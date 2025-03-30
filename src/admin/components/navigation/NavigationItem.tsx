
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { adminEditModeAtom, dragSourceIdAtom, isDraggingAtom, dropIndicatorPositionAtom } from '@/admin/atoms/tools.atoms';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  tooltipContent?: React.ReactNode;
}

export function NavigationItem({
  id,
  label,
  icon,
  description,
  isActive = false,
  onClick,
  className = '',
  tooltipContent,
}: NavigationItemProps) {
  const [editMode] = useAtom(adminEditModeAtom);
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom);
  const [, setDragSourceId] = useAtom(dragSourceIdAtom);
  const [, setDropPosition] = useAtom(dropIndicatorPositionAtom);
  const itemRef = useRef<HTMLDivElement>(null);

  // Enable drag and drop only in edit mode
  useEffect(() => {
    const element = itemRef.current;
    if (!element) return;
    
    const handleDragStart = (e: DragEvent) => {
      if (!editMode) {
        e.preventDefault();
        return;
      }
      
      setIsDragging(true);
      setDragSourceId(id);
      
      // Set position for drag indicator
      setDropPosition({ x: e.clientX, y: e.clientY });
      
      // Add drag data for compatibility
      e.dataTransfer?.setData('text/plain', id);
      
      // Create a custom drag image (optional)
      const dragImage = document.createElement('div');
      dragImage.textContent = label;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-9999px';
      document.body.appendChild(dragImage);
      e.dataTransfer?.setDragImage(dragImage, 0, 0);
      
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    };
    
    const handleDragEnd = () => {
      setIsDragging(false);
      setDragSourceId(null);
      setDropPosition(null);
    };
    
    if (editMode) {
      element.setAttribute('draggable', 'true');
      element.addEventListener('dragstart', handleDragStart as EventListener);
      element.addEventListener('dragend', handleDragEnd);
    } else {
      element.removeAttribute('draggable');
    }
    
    return () => {
      element.removeEventListener('dragstart', handleDragStart as EventListener);
      element.removeEventListener('dragend', handleDragEnd);
    };
  }, [editMode, id, setIsDragging, setDragSourceId, setDropPosition, label]);

  const item = (
    <motion.div
      ref={itemRef}
      layout
      className={cn(
        "nav-item", 
        isActive ? "active" : "", 
        editMode ? "draggable" : "",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        scale: { 
          duration: 0.15
        }
      }}
      data-id={id}
    >
      {editMode && (
        <motion.div 
          className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
      
      {icon && (
        <div className="nav-item__icon">
          {icon}
          <div className="nav-item__icon-glow" />
        </div>
      )}
      
      <span className="nav-item__label">{label}</span>
      {description && <span className="nav-item__description text-xs opacity-70">{description}</span>}
      
      {editMode && (
        <motion.div 
          className="nav-item__drag-handle ml-auto"
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 8C4 8.55228 3.55228 9 3 9C2.44772 9 2 8.55228 2 8C2 7.44772 2.44772 7 3 7C3.55228 7 4 7.44772 4 8Z" fill="currentColor"/>
            <path d="M9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8Z" fill="currentColor"/>
            <path d="M14 8C14 8.55228 13.5523 9 13 9C12.4477 9 12 8.55228 12 8C12 7.44772 12.4477 7 13 7C13.5523 7 14 7.44772 14 8Z" fill="currentColor"/>
            <path d="M4 3C4 3.55228 3.55228 4 3 4C2.44772 4 2 3.55228 2 3C2 2.44772 2.44772 2 3 2C3.55228 2 4 2.44772 4 3Z" fill="currentColor"/>
            <path d="M9 3C9 3.55228 8.55228 4 8 4C7.44772 4 7 3.55228 7 3C7 2.44772 7.44772 2 8 2C8.55228 2 9 2.44772 9 3Z" fill="currentColor"/>
            <path d="M14 3C14 3.55228 13.5523 4 13 4C12.4477 4 12 3.55228 12 3C12 2.44772 12.4477 2 13 2C13.5523 2 14 2.44772 14 3Z" fill="currentColor"/>
            <path d="M4 13C4 13.5523 3.55228 14 3 14C2.44772 14 2 13.5523 2 13C2 12.4477 2.44772 12 3 12C3.55228 12 4 12.4477 4 13Z" fill="currentColor"/>
            <path d="M9 13C9 13.5523 8.55228 14 8 14C7.44772 14 7 13.5523 7 13C7 12.4477 7.44772 12 8 12C8.55228 12 9 12.4477 9 13Z" fill="currentColor"/>
            <path d="M14 13C14 13.5523 13.5523 14 13 14C12.4477 14 12 13.5523 12 13C12 12.4477 12.4477 12 13 12C13.5523 12 14 12.4477 14 13Z" fill="currentColor"/>
          </svg>
        </motion.div>
      )}
    </motion.div>
  );

  if (tooltipContent || description) {
    return (
      <AdminTooltip content={tooltipContent || description} side="right">
        {item}
      </AdminTooltip>
    );
  }

  return item;
}
