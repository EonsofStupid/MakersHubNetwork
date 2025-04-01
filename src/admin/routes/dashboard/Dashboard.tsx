
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
    console.log("Dashboard component mounted");
    console.log("Authentication status:", isAuthenticated);
    console.log("Has admin access:", hasAdminAccess);
    console.log("Store initialized:", hasInitialized);
    
    if (isAuthenticated && hasAdminAccess && !hasInitialized) {
      console.log("Initializing admin store from Dashboard...");
      initializeStore();
    }
  }, [isAuthenticated, hasAdminAccess, hasInitialized, initializeStore]);
  
  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && !hasAdminAccess) {
      console.log("Redirecting to unauthorized page - no admin access");
      navigate('/admin/unauthorized');
    }
  }, [isAuthenticated, hasAdminAccess, navigate]);
  
  // If no layout exists and user has permission, create a default one
  useEffect(() => {
    console.log("Dashboard layout status:", { 
      isLoading, 
      hasLayout: !!dashboardSkeleton, 
      hasError: !!error 
    });
    
    if (!isLoading && !dashboardSkeleton && !error && hasAdminAccess) {
      console.log("Creating default dashboard layout...");
      createDefaultLayout({ type: 'dashboard', scope: 'admin' });
    }
  }, [isLoading, dashboardSkeleton, error, hasAdminAccess, createDefaultLayout]);

  // Convert skeleton to layout using the service
  const dashboardLayout = dashboardSkeleton ? 
    layoutSkeletonService.convertToLayout(dashboardSkeleton) : null;
  
  console.log("Dashboard layout:", dashboardLayout);
  
  if (isLoading) {
    console.log("Dashboard is loading...");
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
        <p className="text-muted-foreground">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
  
  console.log("Rendering dashboard with layout:", !!dashboardLayout);
  
  return (
    <LayoutRenderer
      layout={dashboardLayout}
      isLoading={isLoading}
      error={error instanceof Error ? error : null}
      fallback={<DashboardLayout />}
    />
  );
}
