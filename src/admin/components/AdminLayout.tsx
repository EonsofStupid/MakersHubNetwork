
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { AdminTopNav } from '@/admin/components/navigation/AdminTopNav';
import { DragIndicator } from '@/admin/components/ui/DragIndicator';
import { FrozenZones } from '@/admin/components/overlay/FrozenZones';
import { EffectsPalette } from '@/admin/components/overlay/EffectsPalette';
import { useLayoutSkeleton } from '@/admin/hooks/useLayoutSkeleton';
import { initializeAdminLayouts } from '@/admin/utils/adminInitialization';
import { layoutSkeletonService } from '@/admin/services/layoutSkeleton.service';

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
  const { useActiveLayout, useCreateDefaultLayout } = useLayoutSkeleton();
  const { mutate: createDefaultLayout } = useCreateDefaultLayout();
  
  // Get layouts from the database
  const { data: sidebarSkeleton, isLoading: isLoadingSidebar } = useActiveLayout('sidebar', 'admin');
  const { data: topNavSkeleton, isLoading: isLoadingTopNav } = useActiveLayout('topnav', 'admin');
  
  // Convert skeletons to layouts
  const sidebarLayout = sidebarSkeleton ? layoutSkeletonService.convertToLayout(sidebarSkeleton) : null;
  const topNavLayout = topNavSkeleton ? layoutSkeletonService.convertToLayout(topNavSkeleton) : null;
  
  // Initialize admin layouts if they don't exist
  useEffect(() => {
    const initLayouts = async () => {
      if (!isLoadingSidebar && !sidebarSkeleton) {
        console.log("Creating default sidebar layout...");
        createDefaultLayout({ type: 'sidebar', scope: 'admin' });
      }
      
      if (!isLoadingTopNav && !topNavSkeleton) {
        console.log("Creating default topnav layout...");
        createDefaultLayout({ type: 'topnav', scope: 'admin' });
      }
    };
    
    initLayouts();
  }, [isLoadingSidebar, isLoadingTopNav, sidebarSkeleton, topNavSkeleton, createDefaultLayout]);
  
  // Initialize layouts only once when the app loads
  useEffect(() => {
    initializeAdminLayouts();
  }, []);
  
  // For now we're still using the regular components until we fully migrate to the layout system
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
