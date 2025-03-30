
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, User, Settings, Menu, Shield, Edit, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useToast } from '@/hooks/use-toast';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';

import '@/admin/styles/admin-topnav.css';

interface AdminTopNavProps {
  title?: string;
  className?: string;
}

export function AdminTopNav({ title = "Admin Dashboard", className }: AdminTopNavProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditMode, setEditMode] = useAtom(adminEditModeAtom);
  
  const { 
    sidebarExpanded, 
    toggleSidebar,
  } = useAdminStore();
  
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
              className="w-8 h-8 rounded-full bg-[var(--impulse-bg-card)] flex items-center justify-center border border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)] cursor-pointer overflow-hidden electric-border"
            >
              <User className="w-5 h-5" />
            </motion.div>
          </AdminTooltip>
        </div>
      </div>
    </div>
  );
}
