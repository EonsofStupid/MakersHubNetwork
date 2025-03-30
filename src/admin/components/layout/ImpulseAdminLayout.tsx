
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
import '@/admin/styles/electric-effects.css';
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
  
  // Track mouse position for electric effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      className={cn(
        "impulse-admin-root min-h-screen flex flex-col",
        isEditMode && "edit-mode",
        isDarkMode && "dark-mode",
        "glitch-effect"
      )}
      data-active-section={activeSection}
    >
      {/* Top navigation */}
      <AdminTopNav title={title} />
      
      {/* Main content area with sidebar */}
      <div className="flex-1 flex relative">
        {/* Electric ambient background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--impulse-bg-main)] to-[var(--impulse-bg-main)] opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(0,240,255,0.08)_0%,transparent_60%)]" />
        </div>
        
        {/* Left sidebar */}
        <div className={cn(
          "impulse-sidebar transition-all z-10",
          sidebarExpanded ? "w-60" : "w-16"
        )}>
          <AdminSidebar />
        </div>
        
        {/* Main content */}
        <main className={cn(
          "impulse-main flex-1 p-6 transition-all z-10",
          sidebarExpanded ? "ml-60" : "ml-16",
          "apple-glass backdrop-blur-xl"
        )}>
          {/* Editable indicator in edit mode */}
          {isEditMode && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2 rounded bg-primary/10 border border-primary/20 text-sm text-primary electric-border"
            >
              <span className="font-medium">Edit mode active</span> - Drag items to customize your dashboard
            </motion.div>
          )}
          
          {/* Render children only if user has required permission */}
          {hasPermission(requiresPermission) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {children}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="p-6 rounded-xl glass-panel text-center">
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
