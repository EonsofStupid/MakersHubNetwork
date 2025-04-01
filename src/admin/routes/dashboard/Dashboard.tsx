
import React, { useEffect } from "react";
import { LayoutRenderer } from "@/admin/components/layout/LayoutRenderer";
import { useLayoutSkeleton } from "@/admin/hooks/useLayoutSkeleton";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useAdminStore } from "@/admin/store/admin.store";
import { useNavigate } from "react-router-dom";
import { initializeComponentRegistry } from "@/admin/components/layout/ComponentRegistrations";
import { layoutSkeletonService } from "@/admin/services/layoutSkeleton.service";
import { DashboardLayout } from "@/admin/components/dashboard/DashboardLayout";

// Initialize component registry for layout system
initializeComponentRegistry();

export default function Dashboard() {
  const { hasAdminAccess, isAuthenticated } = useAdminAccess();
  const { initializeStore, hasInitialized } = useAdminStore();
  const navigate = useNavigate();
  
  // Get the dashboard layout from the database
  const { useActiveLayout, useCreateDefaultLayout } = useLayoutSkeleton();
  const { data: dashboardSkeleton, isLoading, error } = useActiveLayout('dashboard', 'admin');
  const { mutate: createDefaultLayout } = useCreateDefaultLayout();
  
  // Initialize admin store if it hasn't been initialized yet
  useEffect(() => {
    if (isAuthenticated && hasAdminAccess && !hasInitialized) {
      initializeStore();
    }
  }, [isAuthenticated, hasAdminAccess, hasInitialized, initializeStore]);
  
  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && !hasAdminAccess) {
      navigate('/admin/unauthorized');
    }
  }, [isAuthenticated, hasAdminAccess, navigate]);
  
  // If no layout exists and user has permission, create a default one
  useEffect(() => {
    if (!isLoading && !dashboardSkeleton && !error && hasAdminAccess) {
      console.log("Creating default dashboard layout...");
      createDefaultLayout({ type: 'dashboard', scope: 'admin' });
    }
  }, [isLoading, dashboardSkeleton, error, hasAdminAccess, createDefaultLayout]);

  // Convert skeleton to layout using the service
  const dashboardLayout = dashboardSkeleton ? 
    layoutSkeletonService.convertToLayout(dashboardSkeleton) : null;
  
  console.log("Dashboard layout:", dashboardLayout);
  
  return (
    <LayoutRenderer
      layout={dashboardLayout}
      isLoading={isLoading}
      error={error instanceof Error ? error : null}
      fallback={<DashboardLayout />}
    />
  );
}
