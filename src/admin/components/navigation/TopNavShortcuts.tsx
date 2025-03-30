
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { useAtom } from 'jotai';
import { adminEditModeAtom, isDraggingAtom } from '@/admin/atoms/tools.atoms';
import { TopNavItem } from '@/admin/components/navigation/TopNavItem';
import { useToast } from '@/hooks/use-toast';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';

interface TopNavShortcutsProps {
  className?: string;
}

export function TopNavShortcuts({ className }: TopNavShortcutsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditMode] = useAtom(adminEditModeAtom);
  const [isDragging] = useAtom(isDraggingAtom);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const { 
    pinnedTopNavItems, 
    setPinnedTopNavItems
  } = useAdminStore();

  // Use the draggable hook for the top nav
  const { registerDropZone } = useDragAndDrop({
    items: pinnedTopNavItems,
    onReorder: setPinnedTopNavItems,
    containerId: 'top-nav-shortcuts',
    acceptExternalItems: true
  });

  // Register the top nav as a drop zone
  useEffect(() => {
    if (dropZoneRef.current) {
      return registerDropZone(dropZoneRef.current);
    }
  }, [registerDropZone]);
  
  // Get icons for the top nav
  const topNavIcons = adminNavigationItems
    .filter(item => pinnedTopNavItems.includes(item.id))
    .map(item => ({
      id: item.id,
      icon: item.icon,
      label: item.label,
      path: item.path
    }));
  
  const removeTopNavItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedTopNavItems(pinnedTopNavItems.filter(item => item !== id));
    
    toast({
      title: "Removed from Top Nav",
      description: "Item has been removed from your quick access menu",
    });
  };
  
  const handleNavClick = (path: string) => {
    navigate(path);
  };
  
  return (
    <motion.div 
      ref={dropZoneRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "admin-topnav-shortcuts flex items-center gap-2 px-4 py-1 rounded-full transition-all",
        isDragging && "ring-2 ring-primary/50 bg-primary/5",
        isEditMode && "edit-mode-highlight",
        className
      )}
      id="top-nav-shortcuts"
      data-container-id="top-nav-shortcuts"
    >
      <AnimatePresence mode="popLayout">
        {topNavIcons.length > 0 ? (
          topNavIcons.map((item) => (
            <TopNavItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => handleNavClick(item.path)}
              onRemove={isEditMode ? (e) => removeTopNavItem(item.id, e) : undefined}
              isEditMode={isEditMode}
            />
          ))
        ) : (
          isEditMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-[var(--impulse-text-secondary)] text-xs px-2"
            >
              <span>Drag items here from sidebar</span>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </motion.div>
  );
}
