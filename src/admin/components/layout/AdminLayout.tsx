
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAdminStore } from "@/admin/store/admin.store";
import { AdminSidebar } from "@/admin/components/AdminSidebar";
import { AdminHeader } from "@/admin/components/AdminHeader";
import { AdminPermission } from "@/admin/types/admin.types";
import { MainNav } from "@/components/MainNav";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
  const { loadPermissions, hasPermission, isLoadingPermissions } = useAdminStore();
  
  useEffect(() => {
    // Load permissions on component mount
    loadPermissions();
  }, [loadPermissions]);

  // Check if user has required permission
  if (!isLoadingPermissions && requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <>
        <MainNav />
        <div className="container mx-auto p-6">
          <Card className="border-destructive/20 p-6 text-center">
            <h2 className="text-2xl font-heading text-destructive mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this admin area.
            </p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 backdrop-blur-sm">
      <MainNav />
      <AdminHeader title={title} />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <AdminSidebar />
          </div>
          
          <div className="lg:col-span-9">
            {isLoadingPermissions ? (
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
  );
};
