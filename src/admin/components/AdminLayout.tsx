
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AdminSidebar } from "@/admin/components/AdminSidebar";
import { AdminHeader } from "@/admin/components/AdminHeader";
import { AdminPermission } from "@/admin/types/admin.types";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardShortcuts } from "@/admin/components/dashboard/DashboardShortcuts";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAdmin } from "@/admin/context/AdminContext";
import { useAdminStore } from "@/admin/store/admin.store";
import { useAdminPreferences } from "@/admin/store/adminPreferences.store";

interface AdminLayoutProps {
  children: React.ReactNode;
  requiredPermission?: AdminPermission;
  title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  requiredPermission = "admin:access",
  title = "Admin Dashboard"
}) => {
  const { checkPermission, isLoading } = useAdmin();
  const { 
    scrollY, 
    sidebarExpanded, 
    setActiveSection 
  } = useAdminStore();
  const { 
    isDashboardCollapsed, 
    setDashboardCollapsed, 
    loadPreferences
  } = useAdminPreferences();

  useEffect(() => {
    // Load preferences on component mount
    loadPreferences();
    
    // Extract the current section from location
    const path = window.location.pathname.split('/');
    const section = path[path.length - 1] || 'overview';
    setActiveSection(section);
    
    // Add the admin theme class
    document.body.classList.add('impulse-admin-root');
    
    return () => {
      // Remove the admin theme class when unmounting
      document.body.classList.remove('impulse-admin-root');
    };
  }, [loadPreferences, setActiveSection]);

  // Toggle dashboard collapsed state
  const toggleDashboard = () => {
    setDashboardCollapsed(!isDashboardCollapsed);
  };

  // Check if user has required permission
  if (!isLoading && requiredPermission && !checkPermission(requiredPermission)) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive/20 p-6 text-center">
          <h2 className="text-2xl font-heading text-destructive mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this admin area.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-theme min-h-screen">
      <AdminHeader title={title} />
      
      <div className={cn(
        "transition-all duration-300 ease-in-out pt-20 pb-8",
        isDashboardCollapsed ? "py-2" : "py-4"
      )}>
        <div className="container mx-auto px-4">
          {/* Dashboard Toggle Button */}
          <div className="flex justify-center mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDashboard}
              className="rounded-full h-8 w-8 p-0 bg-primary/10 hover:bg-primary/20"
            >
              {isDashboardCollapsed ? 
                <ChevronDown className="h-4 w-4 text-primary" /> : 
                <ChevronUp className="h-4 w-4 text-primary" />
              }
            </Button>
          </div>
          
          {/* Collapsible Dashboard Shortcuts */}
          <div className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isDashboardCollapsed ? "max-h-0 opacity-0 mb-0" : "max-h-[200px] opacity-100 mb-6"
          )}>
            <ErrorBoundary>
              <DashboardShortcuts />
            </ErrorBoundary>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={cn(
              "transition-all duration-300 ease-in-out",
              isDashboardCollapsed ? "lg:col-span-2" : "lg:col-span-3"
            )}>
              <AdminSidebar collapsed={isDashboardCollapsed} />
            </div>
            
            <div className={cn(
              "transition-all duration-300 ease-in-out",
              isDashboardCollapsed ? "lg:col-span-10" : "lg:col-span-9"
            )}>
              {isLoading ? (
                <Card className="p-8 flex justify-center items-center min-h-[400px]">
                  <div className="space-y-4 text-center">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground">Loading admin panel...</p>
                  </div>
                </Card>
              ) : (
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
