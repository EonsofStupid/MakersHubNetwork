
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { AdminTopNav } from '@/admin/components/layout/AdminTopNav';
import { DragIndicator } from '@/admin/components/ui/DragIndicator';
import { FrozenZones } from '@/admin/components/overlay/FrozenZones';
import { EffectsPalette } from '@/admin/components/overlay/EffectsPalette';

// Import all necessary styles
import '@/admin/styles/admin-core.css';
import '@/admin/styles/admin-topnav.css';
import '@/admin/styles/navigation.css';
import '@/admin/styles/sidebar-navigation.css';
import '@/admin/styles/dashboard-shortcuts.css';
import '@/admin/styles/drag-drop.css';
import '@/admin/styles/cyber-effects.css';
import '@/admin/styles/electric-effects.css';

interface AdminLayoutProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

export function AdminLayout({ children, title = "Admin Dashboard", className }: AdminLayoutProps) {
  const { sidebarExpanded } = useAdminStore();
  
  return (
    <div 
      className={cn(
        "admin-layout min-h-screen flex w-full",
        "bg-[var(--impulse-bg-main)]",
        "text-[var(--impulse-text-primary)]"
      )}
    >
      {/* Admin Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          marginLeft: sidebarExpanded ? '240px' : '80px' 
        }}
        className={cn(
          "flex-1 transition-all duration-300 relative overflow-auto",
          className
        )}
      >
        {/* Top Navigation - Fixed */}
        <div className="sticky top-0 z-40 w-full">
          <AdminTopNav title={title} />
        </div>
        
        {/* Page Content - Scrollable */}
        <div className="p-6">
          {children}
        </div>
        
        {/* Floating UI Components */}
        <DragIndicator />
        <FrozenZones />
        <EffectsPalette />
      </motion.main>
    </div>
  );
}
