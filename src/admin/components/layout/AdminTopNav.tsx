
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, Menu, Shield, Edit, X, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

import '@/admin/styles/admin-topnav.css';

interface AdminTopNavProps {
  title?: string;
  className?: string;
}

export function AdminTopNav({ title = "Admin Dashboard", className }: AdminTopNavProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    sidebarExpanded, 
    pinnedTopNavItems, 
    setPinnedTopNavItems,
    toggleSidebar, 
    isEditMode, 
    toggleEditMode,
    dragSource,
    setDragSource,
    dragTarget,
    setDragTarget 
  } = useAdminStore();
  
  const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(false);
  
  // Get icons for the top nav
  const topNavIcons = adminNavigationItems
    .filter(item => pinnedTopNavItems.includes(item.id))
    .map(item => ({
      id: item.id,
      icon: item.icon,
      label: item.label,
      path: item.path
    }));
    
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
      toast({
        title: "Added to Quick Access",
        description: "Item has been added to your top navigation",
      });
    }
    
    setDragTarget(null);
    setDragSource(null);
  };
  
  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setPinnedTopNavItems(pinnedTopNavItems.filter(item => item !== id));
    toast({
      title: "Removed",
      description: "Item has been removed from your top navigation",
    });
  };
  
  const handleNavClick = (path: string) => {
    navigate(path);
  };
  
  const toggleDashboard = () => {
    setIsDashboardCollapsed(!isDashboardCollapsed);
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
          
          <Link to="/admin" className="text-[var(--impulse-text-primary)] hover:text-[var(--impulse-primary)] transition-colors flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--impulse-primary)]" />
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold"
            >
              {title}
            </motion.h1>
          </Link>
        </div>
        
        <div 
          className={cn(
            "admin-topnav-shortcuts flex items-center gap-2 px-4 py-1 rounded-full transition-all",
            dragTarget === 'topnav' && "bg-[var(--impulse-primary)]/10 ring-2 ring-[var(--impulse-primary)]/30"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <AnimatePresence mode="popLayout">
            {topNavIcons.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`topnav-${item.id}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative"
              >
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleNavClick(item.path)}
                        className="p-2 rounded-full bg-[var(--impulse-bg-card)] text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-primary)]/20 hover:text-[var(--impulse-primary)] transition-all"
                      >
                        {item.icon}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-[var(--impulse-bg-overlay)] border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)] z-50">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {isEditMode && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                    onClick={(e) => removeItem(item.id, e)}
                  >
                    ×
                  </motion.button>
                )}
              </motion.div>
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)] relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--impulse-secondary)] rounded-full"></span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent className="bg-[var(--impulse-bg-overlay)] border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)]">
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent className="bg-[var(--impulse-bg-overlay)] border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)]">
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full bg-[var(--impulse-bg-card)] flex items-center justify-center border border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)] cursor-pointer overflow-hidden"
                >
                  <User className="w-5 h-5" />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-[var(--impulse-bg-overlay)] border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)]">
                Account
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
