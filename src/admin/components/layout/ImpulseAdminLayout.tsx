
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
import { QuickActionBar } from "./QuickActionBar";
import { useAdminPermissions } from "@/admin/hooks/useAdminPermissions";

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
  const { loadPermissions } = useAdminStore();
  const { checkPermission, isLoading } = useAdminPermissions();
  const { 
    isDashboardCollapsed, 
    setDashboardCollapsed, 
    loadPreferences 
  } = useAdminPreferences();

  useEffect(() => {
    // Load permissions and preferences on mount
    loadPermissions();
    loadPreferences();
    
    // Load the cyberpunk theme CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/admin-theme.css';
    document.head.appendChild(link);
    
    return () => {
      // Clean up when unmounting
      if (link && document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [loadPermissions, loadPreferences]);

  if (!isLoading && requiresPermission && !checkPermission(requiresPermission)) {
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
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : (
                children
              )}
            </ErrorBoundary>
          </main>
        </div>
        
        {/* Quick Action Bar - Floating toolbar for admin tools */}
        <QuickActionBar />
        
        {/* Admin Inspector - Activated with Alt+Click */}
        <AdminInspector />
      </div>
    </AdminThemeProvider>
  );
}
