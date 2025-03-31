
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { AdminTopNav } from '@/admin/components/layout/AdminTopNav';
import { DragIndicator } from '@/admin/components/ui/DragIndicator';
import { FrozenZones } from '@/admin/components/overlay/FrozenZones';
import { EffectsPalette } from '@/admin/components/overlay/EffectsPalette';
import { scrollbarStyle } from '@/admin/utils/styles';

// Import all necessary styles
import '@/admin/styles/admin-core.css';
import '@/admin/styles/admin-topnav.css';
import '@/admin/styles/navigation.css';
import '@/admin/styles/sidebar-navigation.css';
import '@/admin/styles/dashboard-shortcuts.css';
import '@/admin/styles/drag-drop.css';
import '@/admin/styles/cyber-effects.css';
import '@/admin/styles/electric-effects.css';

interface ImpulseAdminLayoutProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
  readonly?: boolean;
}

export function ImpulseAdminLayout({ children, title = "Admin Dashboard", className, readonly = false }: ImpulseAdminLayoutProps) {
  const { sidebarExpanded } = useAdminStore();
  
  return (
    <div 
      className={cn(
        "impulse-admin-layout min-h-screen flex w-full",
        "bg-[var(--impulse-bg-main)]",
        "text-[var(--impulse-text-primary)]",
        readonly && "admin-readonly-mode"
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
          "flex-1 transition-all duration-300",
          "pt-14 pb-6 px-6", // Account for fixed topnav
          scrollbarStyle,
          className
        )}
      >
        {/* Top Navigation */}
        <AdminTopNav title={title} readonly={readonly} />
        
        {/* Page Content */}
        <div className="mt-6">
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
