
import React, { ReactNode, useEffect } from 'react';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { AdminTopNav } from '@/admin/components/navigation/AdminTopNav';
import { useAdminStore } from '@/admin/store/admin.store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TopNavShortcuts } from '../navigation/TopNavShortcuts';
import { DragIndicator } from '../ui/DragIndicator';

interface ImpulseAdminLayoutProps {
  children: ReactNode;
}

export function ImpulseAdminLayout({ children }: ImpulseAdminLayoutProps) {
  const { isEditMode, sidebarExpanded } = useAdminStore();
  
  // Apply edit mode class to body
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
    <div className="flex h-screen overflow-hidden w-full">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main content area */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300",
        sidebarExpanded ? "ml-[240px]" : "ml-[80px]"
      )}>
        {/* Top navigation */}
        <div className={cn(
          "admin-topnav border-b border-[var(--impulse-border-normal)] glassmorphism z-20",
          "transition-all duration-300 ease-in-out w-full"
        )}>
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-[var(--impulse-text-primary)]"
              >
                MakersImpulse
              </motion.div>
              
              {/* Top navigation shortcuts */}
              <TopNavShortcuts />
            </div>
            
            {/* Right side of top nav - user menu, etc. */}
            <AdminTopNav />
          </div>
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
          <main>
            {children}
          </main>
        </div>
      </div>

      {/* Drag indicator for visual feedback */}
      <DragIndicator />
    </div>
  );
}
