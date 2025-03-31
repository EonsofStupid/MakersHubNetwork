
import React, { ReactNode, useEffect } from 'react';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { AdminTopNav } from '@/admin/components/navigation/AdminTopNav';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TopNavShortcuts } from '../navigation/TopNavShortcuts';
import { DragIndicator } from '../ui/DragIndicator';
import { FrozenZones } from '../overlay/FrozenZones';

interface ImpulseAdminLayoutProps {
  children: ReactNode;
}

export function ImpulseAdminLayout({ children }: ImpulseAdminLayoutProps) {
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Add edit-mode class to body when edit mode is active
  useEffect(() => {
    if (isEditMode) {
      document.body.classList.add('edit-mode');
    } else {
      document.body.classList.remove('edit-mode');
    }
    
    return () => {
      document.body.classList.remove('edit-mode');
    };
  }, [isEditMode]);
  
  return (
    <div className="flex h-screen overflow-hidden w-full bg-[var(--impulse-bg-main)]">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <div className={cn(
          "admin-topnav border-b border-[var(--impulse-border-normal)] glassmorphism z-20 w-full",
          "transition-all duration-300 ease-in-out"
        )}>
          <AdminTopNav />
        </div>
        
        {/* Main content */}
        <div className={cn(
          "flex-1 overflow-auto",
          isEditMode && "bg-primary/5"
        )}>
          {/* Edit mode indicator */}
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sticky top-0 w-full bg-primary text-white py-1 text-center text-sm font-medium z-10"
            >
              Edit Mode: Drag and drop items to customize your dashboard
            </motion.div>
          )}
          
          {/* Main content wrapper */}
          <main className="p-6 pt-16">
            {children}
          </main>
        </div>
      </div>
      
      {/* Drag indicator and frozen zones for edit mode */}
      <DragIndicator />
      <FrozenZones />
    </div>
  );
}
