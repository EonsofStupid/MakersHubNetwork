
import React, { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { AdminSidebar } from "@/admin/components/AdminSidebar";
import { AdminTopNav } from "@/admin/components/layout/AdminTopNav";
import { useAdmin } from "@/admin/context/AdminContext";
import { AdminPermission } from "@/admin/types/admin.types";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface ImpulseAdminLayoutProps {
  children: ReactNode;
  title?: string;
  requiresPermission?: AdminPermission;
}

export function ImpulseAdminLayout({
  children,
  title = "Admin Dashboard",
  requiresPermission = "admin:access"
}: ImpulseAdminLayoutProps) {
  const { checkPermission, isLoading } = useAdmin();

  // Check for required permission
  const hasPermission = checkPermission(requiresPermission);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <Card className="border-destructive/20 p-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-destructive">Access Denied</h3>
          <p className="text-muted-foreground">
            You don't have permission to access this section.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn(
      "admin-impulse-layout",
      "min-h-[calc(100vh-4rem)]"
    )}>
      <ErrorBoundary>
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminTopNav title={title} className="w-full" />
            
            <main className="flex-1 overflow-y-auto pt-20 px-6 pb-6">
              {children}
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
