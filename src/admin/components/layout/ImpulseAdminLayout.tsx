
import React, { useEffect } from 'react';
import { AdminTopNav } from '@/admin/components/navigation/AdminTopNav';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { useAdminStore } from '@/admin/store/admin.store';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { DragIndicator } from '@/admin/components/ui/DragIndicator';
import { motion } from 'framer-motion';
import { AdminPermission } from '@/admin/types/admin.types';

// Import our cyberpunk style sheets
import '@/admin/styles/cyber-effects.css';
import '@/admin/theme/impulse/impulse-admin.css';
import '@/admin/theme/impulse/impulse-theme.css';

interface ImpulseAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  requiresPermission?: AdminPermission;
}

export function ImpulseAdminLayout({ 
  children,
  title = "Admin Dashboard",
  requiresPermission = "admin:access"
}: ImpulseAdminLayoutProps) {
  const { sidebarExpanded, hasPermission, isDarkMode, activeSection } = useAdminStore();
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Set page title
  useEffect(() => {
    document.title = `${title} | MakersImpulse Admin`;
    return () => {
      document.title = 'MakersImpulse';
    };
  }, [title]);
  
  // Apply dark mode class to the document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  
  return (
    <div 
      className={cn(
        "impulse-admin-root min-h-screen flex flex-col",
        isEditMode && "edit-mode",
        isDarkMode && "dark-mode"
      )}
      data-active-section={activeSection}
    >
      {/* Top navigation */}
      <AdminTopNav title={title} />
      
      {/* Main content area with sidebar */}
      <div className="flex-1 flex">
        {/* Left sidebar */}
        <div className={cn(
          "impulse-sidebar transition-all",
          sidebarExpanded ? "w-60" : "w-16"
        )}>
          <AdminSidebar />
        </div>
        
        {/* Main content */}
        <main className={cn(
          "impulse-main flex-1 p-6 transition-all",
          sidebarExpanded ? "ml-60" : "ml-16"
        )}>
          {/* Editable indicator in edit mode */}
          {isEditMode && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2 rounded bg-primary/10 border border-primary/20 text-sm text-primary"
            >
              <span className="font-medium">Edit mode active</span> - Drag items to customize your dashboard
            </motion.div>
          )}
          
          {/* Render children only if user has required permission */}
          {hasPermission(requiresPermission) ? (
            children
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="p-6 rounded-xl bg-card text-center">
                <h3 className="text-xl font-semibold mb-2">Permission Required</h3>
                <p className="text-muted-foreground">
                  You need {requiresPermission} permission to access this page.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Global drag indicator */}
      <DragIndicator />
    </div>
  );
}
