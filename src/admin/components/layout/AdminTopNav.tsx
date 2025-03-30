
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, Menu, Shield, Edit, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { useAtom } from 'jotai';
import { 
  adminEditModeAtom, 
  isDraggingAtom, 
  dragSourceIdAtom, 
  dragTargetIdAtom, 
  dropIndicatorPositionAtom 
} from '@/admin/atoms/tools.atoms';
import { TopNavItem } from '@/admin/components/navigation/TopNavItem';
import { useToast } from '@/hooks/use-toast';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';

import '@/admin/styles/admin-topnav.css';

interface AdminTopNavProps {
  title?: string;
  className?: string;
}

export function AdminTopNav({ title = "Admin Dashboard", className }: AdminTopNavProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditMode, setEditMode] = useAtom(adminEditModeAtom);
  const [isDragging] = useAtom(isDraggingAtom);
  const [dragSourceId] = useAtom(dragSourceIdAtom);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const { 
    sidebarExpanded, 
    toggleSidebar,
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
  
  const toggleEditMode = () => {
    setEditMode(!isEditMode);
    
    if (!isEditMode) {
      toast({
        title: "Edit Mode Enabled",
        description: "You can now customize your admin interface by dragging items",
        duration: 4000,
      });
    } else {
      toast({
        title: "Edit Mode Disabled",
        description: "Your customizations have been saved",
      });
    }
  };
  
  return (
    <div className={cn(
      "admin-topnav-container fixed top-0 left-0 right-0 z-40",
      className
    )}>
      <div className="admin-topnav border-b border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-overlay)] backdrop-blur-xl h-14 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
          
          <div className="text-[var(--impulse-text-primary)] hover:text-[var(--impulse-primary)] transition-colors flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--impulse-primary)]" />
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold"
            >
              {title}
            </motion.h1>
          </div>
        </div>
        
        <motion.div 
          ref={dropZoneRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "admin-topnav-shortcuts flex items-center gap-2 px-4 py-1 rounded-full transition-all",
            isDragging && "ring-2 ring-primary/50 bg-primary/5",
            isEditMode && "edit-mode-highlight",
          )}
          id="top-nav-shortcuts"
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
        
        <div className="flex items-center space-x-3">
          <AdminTooltip 
            content={isEditMode ? "Exit Edit Mode" : "Customize Interface"} 
            side="bottom"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleEditMode}
              className={cn(
                "p-2 rounded-full transition-colors",
                isEditMode 
                  ? "bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)]" 
                  : "hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-secondary)]"
              )}
            >
              {isEditMode ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            </motion.button>
          </AdminTooltip>
          
          <AdminTooltip content="Notifications" side="bottom">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)] relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--impulse-secondary)] rounded-full"></span>
            </motion.button>
          </AdminTooltip>
          
          <AdminTooltip content="Settings" side="bottom">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </AdminTooltip>
          
          <AdminTooltip content="User Account" side="bottom">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-[var(--impulse-bg-card)] flex items-center justify-center border border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)] cursor-pointer overflow-hidden"
            >
              <User className="w-5 h-5" />
            </motion.div>
          </AdminTooltip>
        </div>
      </div>
    </div>
  );
}
