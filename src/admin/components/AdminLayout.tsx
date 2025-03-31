
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { AdminTopNav } from '@/admin/components/navigation/AdminTopNav';
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

interface AdminLayoutProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

export function AdminLayout({ children, title = "Admin Dashboard", className }: AdminLayoutProps) {
  const { sidebarExpanded } = useAdminStore();
  
  return (
    <div className="min-h-screen w-full overflow-hidden bg-[var(--impulse-bg-main)] text-[var(--impulse-text-primary)]">
      {/* Full-width TopNav */}
      <AdminTopNav title={title} />
      
      {/* Main content area with sidebar and content */}
      <div className="flex w-full h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content - Scrollable */}
        <motion.div 
          className={cn(
            "flex-1 p-6 mt-14",
            sidebarExpanded ? "ml-[240px]" : "ml-[70px]",
            className
          )}
          style={{
            height: 'calc(100vh - 3.5rem)'
          }}
        >
          {children}
        </motion.div>
        
        {/* Floating UI Components */}
        <DragIndicator />
        <FrozenZones />
        <EffectsPalette />
      </div>
    </div>
  );
}
