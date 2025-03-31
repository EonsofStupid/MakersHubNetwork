
import React, { ReactNode, useEffect, useState } from 'react';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { AdminTopNav } from '@/admin/components/navigation/AdminTopNav';
import { useAdminStore } from '@/admin/store/admin.store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TopNavShortcuts } from '../navigation/TopNavShortcuts';
import { DragIndicator } from '../ui/DragIndicator';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';

interface ImpulseAdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function ImpulseAdminLayout({ children, title = "Admin Dashboard" }: ImpulseAdminLayoutProps) {
  const { isEditMode, toggleEditMode } = useAdminStore();
  const [, setEditMode] = useAtom(adminEditModeAtom);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Sync jotai atom state with zustand store
  useEffect(() => {
    setEditMode(isEditMode);
  }, [isEditMode, setEditMode]);
  
  // Set mounted state for animations
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  return (
    <div className="admin-layout-container h-screen flex flex-col overflow-hidden">
      {/* Top navigation - fixed */}
      <div className="z-40 w-full">
        <AdminTopNav title={title} />
      </div>
      
      {/* Main layout with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          <motion.div 
            className="admin-sidebar-wrapper"
            initial={{ 
              x: hasMounted ? -300 : 0,
              clipPath: hasMounted ? 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)' : 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)'
            }}
            animate={{ 
              x: 0,
              clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)'
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30, 
              delay: hasMounted ? 0.3 : 0 
            }}
          >
            <AdminSidebar />
          </motion.div>
        </AnimatePresence>
        
        {/* Main content area - scrollable */}
        <div className="flex-1 overflow-auto">
          {/* Edit mode indicator */}
          <AnimatePresence>
            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="sticky top-0 w-full bg-[var(--impulse-primary)] text-[var(--impulse-bg-main)] py-1 text-center text-sm font-medium z-10 border-b border-[var(--impulse-primary)]/20"
              >
                <span className="cyber-text pulse-subtle">Edit Mode: Drag items to customize your dashboard and navigation</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main content wrapper */}
          <main className="flex-1 p-6 cyber-grid">
            {children}
          </main>
        </div>
      </div>
      
      {/* Drag indicator for visual feedback when dragging items */}
      <DragIndicator />
    </div>
  );
}
