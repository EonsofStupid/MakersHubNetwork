
import React, { useEffect } from "react";
import { useAdminStore } from "@/admin/store/admin.store";
import { useAdminPreferences } from "@/admin/store/adminPreferences.store";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminHeader } from "../AdminHeader";
import { AdminSidebar } from "../AdminSidebar";
import { AdminInspector } from "../inspector/AdminInspector";
import { AdminThemeProvider } from "@/admin/theme/AdminThemeProvider";
import { AdminPermission } from "@/admin/types/admin.types";

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
  const { hasPermission, isLoadingPermissions, loadPermissions } = useAdminStore();
  const { 
    isDashboardCollapsed, 
    setDashboardCollapsed, 
    loadPreferences 
  } = useAdminPreferences();

  useEffect(() => {
    // Load permissions and preferences on mount
    loadPermissions();
    loadPreferences();
  }, [loadPermissions, loadPreferences]);

  if (!isLoadingPermissions && requiresPermission && !hasPermission(requiresPermission)) {
    return (
      <div className="container mx-auto p-6">
        <div className="border border-destructive/20 p-6 text-center rounded-lg">
          <h2 className="text-2xl font-heading text-destructive mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this admin area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminThemeProvider>
      <div className="impulse-admin min-h-screen bg-[var(--impulse-bg-main)] text-[var(--impulse-text-primary)]">
        <AdminHeader title={title} collapsed={isDashboardCollapsed} />
        
        <div className="flex">
          <AdminSidebar collapsed={isDashboardCollapsed} />
          
          <main className={cn(
            "flex-1 p-6 pt-24 transition-all duration-300",
            "impulse-main-content",
            isDashboardCollapsed ? "collapsed" : ""
          )}>
            <ErrorBoundary>
              {isLoadingPermissions ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : (
                children
              )}
            </ErrorBoundary>
          </main>
        </div>
        
        {/* Admin Inspector - Activated with Alt+Click */}
        <AdminInspector />
      </div>
    </AdminThemeProvider>
  );
}
