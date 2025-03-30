
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  ArrowLeft, 
  Shield, 
  Bell, 
  Settings, 
  User, 
  Edit, 
  X, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { useToast } from '@/hooks/use-toast';
import { TopNavItem } from './navigation/TopNavItem';
import { AdminTooltip } from './ui/AdminTooltip';

import '@/admin/styles/admin-topnav.css';

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title = "Admin Dashboard" }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    toggleSidebar, 
    isEditMode, 
    toggleEditMode,
    pinnedTopNavItems,
    setPinnedTopNavItems,
    dragSource,
    setDragSource,
    dragTarget,
    setDragTarget,
    setDashboardCollapsed,
    isDashboardCollapsed
  } = useAdminStore();
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragSource && !pinnedTopNavItems.includes(dragSource)) {
      setDragTarget('topnav');
    }
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    if (dragTarget === 'topnav') {
      setDragTarget(null);
    }
  };
  
  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedItemId = e.dataTransfer.getData('text/plain');
    
    if (droppedItemId && !pinnedTopNavItems.includes(droppedItemId)) {
      setPinnedTopNavItems([...pinnedTopNavItems, droppedItemId]);
      
      const item = adminNavigationItems.find(nav => nav.id === droppedItemId);
      if (item) {
        toast({
          title: "Added to Quick Access",
          description: `${item.label} has been added to your top navigation`,
        });
      }
    }
    
    setDragTarget(null);
    setDragSource(null);
  };
  
  // Remove item from top nav
  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setPinnedTopNavItems(pinnedTopNavItems.filter(item => item !== id));
    toast({
      title: "Removed",
      description: "Item has been removed from your top navigation",
    });
  };
  
  // Handle navigation
  const handleNavClick = (path: string) => {
    navigate(path);
  };
  
  // Toggle dashboard collapse
  const toggleDashboard = () => {
    setDashboardCollapsed(!isDashboardCollapsed);
  };
  
  // Get items for the top nav
  const topNavIcons = adminNavigationItems
    .filter(item => pinnedTopNavItems.includes(item.id))
    .map(item => ({
      id: item.id,
      icon: item.icon,
      label: item.label,
      path: item.path
    }));
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "admin-topnav fixed top-0 left-0 w-full z-40 h-16",
        "border-b border-[var(--impulse-border-normal)]",
        "backdrop-blur-xl bg-[var(--impulse-bg-overlay)]",
        "flex items-center justify-between px-4"
      )}
    >
      <motion.div 
        className="flex items-center gap-4"
        layoutId="admin-top-nav-left"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        
        <motion.div 
          className="flex items-center gap-2"
          layoutId="admin-title"
        >
          <Shield className="text-[var(--impulse-primary)] w-5 h-5" />
          <h1 className="text-lg font-bold text-[var(--impulse-text-accent)]">
            {title}
          </h1>
        </motion.div>
      </motion.div>
      
      <div 
        className={cn(
          "admin-topnav-shortcuts flex items-center gap-2 px-4 py-1 rounded-full transition-all",
          dragTarget === 'topnav' && "drop-target"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="popLayout">
          {topNavIcons.map((item) => (
            <TopNavItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              label={item.label}
              isEditMode={isEditMode}
              onClick={() => handleNavClick(item.path)}
              onRemove={(e) => removeItem(item.id, e)}
            />
          ))}
          
          {isEditMode && topNavIcons.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[var(--impulse-text-secondary)] text-xs px-2"
            >
              Drag items here
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex items-center space-x-3">
        <AdminTooltip content={isEditMode ? "Exit Edit Mode" : "Edit Navigation"}>
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
        
        <AdminTooltip content={isDashboardCollapsed ? "Expand Dashboard" : "Collapse Dashboard"}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDashboard}
            className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-secondary)]"
          >
            {isDashboardCollapsed ? 
              <ChevronDown className="w-5 h-5" /> : 
              <ChevronUp className="w-5 h-5" />
            }
          </motion.button>
        </AdminTooltip>
        
        <AdminTooltip content="Notifications">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)] relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--impulse-secondary)] rounded-full"></span>
          </motion.button>
        </AdminTooltip>
        
        <AdminTooltip content="Settings">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </AdminTooltip>
        
        <AdminTooltip content="Account">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-[var(--impulse-bg-card)] flex items-center justify-center border border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)] cursor-pointer overflow-hidden"
          >
            <User className="w-5 h-5" />
          </motion.div>
        </AdminTooltip>
      </div>
    </motion.header>
  );
}
