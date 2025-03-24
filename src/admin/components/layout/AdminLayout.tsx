
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminHeader } from "../AdminHeader";
import { AdminSidebar } from "../AdminSidebar";
import { useAdminStore } from "@/admin/store/admin.store";
import { useAdminPreferences } from "@/admin/store/adminPreferences.store";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  requiresPermission?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = "Admin Dashboard",
  requiresPermission = "admin:access"
}) => {
  const location = useLocation();
  const { hasPermission, isLoadingPermissions, loadPermissions, setCurrentSection } = useAdminStore();
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

  // Set current section based on URL
  useEffect(() => {
    const path = location.pathname.split('/');
    const section = path.length > 2 ? path[2] : 'dashboard';
    setCurrentSection(section);
  }, [location, setCurrentSection]);

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
    <div className="admin-theme min-h-screen">
      <AdminHeader title={title} collapsed={isDashboardCollapsed} />
      
      <div className="flex">
        <AdminSidebar collapsed={isDashboardCollapsed} />
        
        <main className={cn(
          "flex-1 p-6 pt-24 transition-all duration-300",
          isDashboardCollapsed ? "ml-[60px]" : "ml-48"
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
    </div>
  );
}
