
import React, { useEffect } from "react";
import { LayoutRenderer } from "@/admin/components/layout/LayoutRenderer";
import { useLayoutSkeleton } from "@/admin/hooks/useLayoutSkeleton";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useAdminStore } from "@/admin/store/admin.store";
import { useNavigate } from "react-router-dom";
import { initializeComponentRegistry } from "@/admin/components/layout/ComponentRegistrations";
import { DashboardLayout } from "@/admin/components/dashboard/DashboardLayout";
import { FallbackLayoutDisplay } from "@/admin/components/layout/FallbackLayoutDisplay";

// Initialize component registry
initializeComponentRegistry();

export default function Dashboard() {
  const { hasAdminAccess, isAuthenticated } = useAdminAccess();
  const { initializeStore, hasInitialized } = useAdminStore();
  const navigate = useNavigate();
  
  // Get the dashboard layout from the database
  const { useActiveLayout, useCreateDefaultLayout } = useLayoutSkeleton();
  const { data: dashboardLayout, isLoading, error } = useActiveLayout('dashboard', 'admin');
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
    if (!isLoading && !dashboardLayout && !error && hasAdminAccess) {
      createDefaultLayout({ type: 'dashboard', scope: 'admin' });
    }
  }, [isLoading, dashboardLayout, error, hasAdminAccess, createDefaultLayout]);
  
  return (
    <LayoutRenderer
      layout={dashboardLayout ?? null}
      isLoading={isLoading}
      error={error instanceof Error ? error : null}
      fallback={
        <FallbackLayoutDisplay type="dashboard" scope="admin">
          <DashboardLayout />
        </FallbackLayoutDisplay>
      }
    />
  );
}
