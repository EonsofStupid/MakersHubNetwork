
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, Menu, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useToast } from '@/hooks/use-toast';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { TopNavShortcuts } from '@/admin/components/navigation/TopNavShortcuts';
import { EditModeToggle } from '@/admin/components/ui/EditModeToggle';

import '@/admin/styles/admin-topnav.css';
import '@/admin/styles/cyber-effects.css';

interface AdminTopNavProps {
  title?: string;
  className?: string;
  readonly?: boolean;
}

export function AdminTopNav({ title = "Admin Dashboard", className, readonly = false }: AdminTopNavProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditMode, setEditMode] = useAtom(adminEditModeAtom);
  
  const { 
    sidebarExpanded, 
    toggleSidebar,
    toggleEditMode,
    savePreferences,
  } = useAdminStore();
  
  // Sync edit mode between jotai atom and zustand store
  useEffect(() => {
    const handleSyncStore = async () => {
      if (isEditMode) {
        await savePreferences();
      }
    };
    
    handleSyncStore();
  }, [isEditMode, savePreferences]);
  
  // Generate random glitch effect
  useEffect(() => {
    const applyRandomGlitch = () => {
      const nav = document.querySelector('.admin-topnav');
      if (nav) {
        nav.classList.add('glitch-effect');
        setTimeout(() => {
          nav.classList.remove('glitch-effect');
        }, 200);
      }
    };
    
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        applyRandomGlitch();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleToggleEditMode = () => {
    if (readonly) return;
    
    // Toggle the edit mode in Zustand store
    toggleEditMode();
    
    // Show appropriate toast
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
    <div className="fixed top-0 left-0 right-0 w-full z-40">
      <div className="admin-topnav w-full flex items-center justify-between px-4 h-14 top-nav-trapezoid">
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
            <Shield className="w-5 h-5 text-[var(--impulse-primary)] pulse-glow" />
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold cyber-text"
            >
              {title}
            </motion.h1>
          </div>
        </div>
        
        {/* Shortcuts in the top navigation */}
        <TopNavShortcuts />
        
        <div className="flex items-center space-x-3">
          <EditModeToggle />
          
          <AdminTooltip content="Notifications" side="bottom">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)] relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--impulse-secondary)] rounded-full pulse-subtle"></span>
            </motion.button>
          </AdminTooltip>
          
          <AdminTooltip content="Settings" side="bottom">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)] electric-hover"
              onClick={() => navigate('/admin/settings')}
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
