import React, { useEffect } from 'react';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { useAdminStore } from '@/admin/store/admin.store';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { DragIndicator } from '@/admin/components/ui/DragIndicator';
import { motion } from 'framer-motion';
import { AdminPermission } from '@/admin/types/admin.types';
import { SimpleCyberText } from '@/components/theme/SimpleCyberText';
import { AdminTopNav } from '@/admin/components/layout/AdminTopNav';

// Import our cyberpunk style sheets
import '@/admin/styles/cyber-effects.css';
import '@/admin/styles/electric-effects.css';
import '@/admin/styles/admin-topnav.css';
import '@/admin/styles/dashboard-shortcuts.css';
import '@/admin/styles/drag-drop.css';
import '@/admin/styles/navigation.css';
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
  
  useEffect(() => {
    document.title = `${title} | MakersImpulse Admin`;
    return () => {
      document.title = 'MakersImpulse';
    };
  }, [title]);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  
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

  useEffect(() => {
    const createScanLine = () => {
      const sidebarElement = document.querySelector('.admin-sidebar');
      if (!sidebarElement) return;
      
      const scanLine = document.createElement('div');
      scanLine.className = 'admin-sidebar-scan';
      sidebarElement.appendChild(scanLine);
      
      setTimeout(() => {
        sidebarElement.removeChild(scanLine);
      }, 15000); // Remove after animation completes
    };
    
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        createScanLine();
      }
    }, 5000);
    
    return () => clearInterval(interval);
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
      <AdminTopNav title={title} />
      
      <div className="flex-1 flex relative mt-14">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--impulse-bg-main)] to-[var(--impulse-bg-main)] opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(0,240,255,0.08)_0%,transparent_60%)]" />
        </div>
        
        <div className={cn(
          "impulse-sidebar transition-all z-10 electric-background", 
          sidebarExpanded ? "w-60" : "w-16"
        )}>
          <AdminSidebar />
        </div>
        
        <main className={cn(
          "impulse-main flex-1 p-6 transition-all z-10",
          sidebarExpanded ? "ml-60" : "ml-16",
          "apple-glass backdrop-blur-xl"
        )}>
          {isEditMode && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2 rounded bg-primary/10 border border-primary/20 text-sm text-primary electric-border"
            >
              <span className="font-medium cyber-text">Edit mode active</span> - Drag items to customize your dashboard
            </motion.div>
          )}
          
          {hasPermission(requiresPermission) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold mb-6 cyber-text">
                <SimpleCyberText text={title} />
              </h1>
              {children}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="p-6 rounded-xl glass-panel text-center">
                <h3 className="text-xl font-semibold mb-2 cyber-text">Permission Required</h3>
                <p className="text-muted-foreground">
                  You need {requiresPermission} permission to access this page.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <DragIndicator />
    </div>
  );
}
