
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useAdminStore } from '@/admin/store/admin.store';
import { TopNavItem } from './TopNavItem';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { adminNavigationItems } from '@/admin/config/navigation.config';

export function TopNavShortcuts() {
  const navigate = useNavigate();
  const shortcutsRef = useRef<HTMLDivElement>(null);
  const [isEditMode] = useAtom(adminEditModeAtom);
  const { pinnedTopNavItems, setPinnedTopNavItems } = useAdminStore();
  
  // Set up drag and drop for the container
  const { registerDropZone } = useDragAndDrop({
    items: pinnedTopNavItems,
    onReorder: setPinnedTopNavItems,
    containerId: 'top-nav-shortcuts',
    dragOnlyInEditMode: true
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
    }
  };
  
  // Handle removing an item from shortcuts
  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newShortcuts = pinnedTopNavItems.filter(item => item !== id);
    setPinnedTopNavItems(newShortcuts);
  };
  
  // Filter shortcuts to only show items that exist in navigation config
  const visibleShortcuts = pinnedTopNavItems.filter(id => 
    adminNavigationItems.some(item => item.id === id)
  );
  
  return (
    <div 
      ref={shortcutsRef}
      className={`admin-topnav-shortcuts ${isEditMode ? 'edit-mode-highlight' : ''}`}
      data-container-id="top-nav-shortcuts"
    >
      {visibleShortcuts.map(id => {
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
      })}
    </div>
  );
}
