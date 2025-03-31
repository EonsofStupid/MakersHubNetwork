
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useAdminStore } from '@/admin/store/admin.store';
import { TopNavItem } from './TopNavItem';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { DragIndicator } from '../ui/DragIndicator';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export function TopNavShortcuts() {
  const navigate = useNavigate();
  const shortcutsRef = useRef<HTMLDivElement>(null);
  const [isEditMode] = useAtom(adminEditModeAtom);
  const { pinnedTopNavItems, setPinnedTopNavItems } = useAdminStore();
  
  // Set up drag and drop for the container
  const { registerDropZone, isDragging } = useDragAndDrop({
    items: pinnedTopNavItems,
    onReorder: setPinnedTopNavItems,
    containerId: 'top-nav-shortcuts',
    dragOnlyInEditMode: true,
    acceptExternalItems: true
  });
  
  // Register the shortcuts container as a drop zone
  useEffect(() => {
    if (shortcutsRef.current) {
      return registerDropZone(shortcutsRef.current);
    }
  }, [registerDropZone]);
  
  // Handle navigation to the corresponding route when a shortcut is clicked
  const handleItemClick = (id: string) => {
    const item = adminNavigationItems.find(item => item.id === id);
    if (item) {
      navigate(item.path);
      toast.success(`Navigating to ${item.label}`);
    }
  };
  
  // Handle removing an item from shortcuts
  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newShortcuts = pinnedTopNavItems.filter(item => item !== id);
    setPinnedTopNavItems(newShortcuts);
    toast.success(`Removed ${id} from shortcuts`);
  };
  
  // Filter shortcuts to only show items that exist in navigation config
  const visibleShortcuts = pinnedTopNavItems.filter(id => 
    adminNavigationItems.some(item => item.id === id)
  );
  
  return (
    <>
      <motion.div 
        ref={shortcutsRef}
        className={`admin-topnav-shortcuts flex items-center gap-2 ${isEditMode ? 'edit-mode-highlight border border-dashed border-[var(--impulse-primary)]/50 rounded-lg p-1' : ''} ${isDragging ? 'bg-[var(--impulse-primary)]/5 rounded-lg' : ''}`}
        data-container-id="top-nav-shortcuts"
        animate={isEditMode ? { 
          boxShadow: isDragging ? "0 0 0 2px rgba(0, 240, 255, 0.3)" : "none"
        } : {}}
      >
        <AnimatePresence mode="popLayout">
          {visibleShortcuts.length > 0 ? (
            visibleShortcuts.map(id => {
              const item = adminNavigationItems.find(navItem => navItem.id === id);
              if (!item) return null;
              
              return (
                <TopNavItem
                  key={id}
                  id={id}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => handleItemClick(id)}
                  onRemove={isEditMode ? (e) => handleRemoveItem(id, e) : undefined}
                  isEditMode={isEditMode}
                />
              );
            })
          ) : (
            isEditMode && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-10 px-3 text-[var(--impulse-text-secondary)] text-sm"
              >
                <Plus className="w-4 h-4 mr-2 text-[var(--impulse-primary)]" />
                <span>Drag items here</span>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>
      
      <DragIndicator />
    </>
  );
}
