
import React from "react";
import { ImpulseAdminLayout } from "./ImpulseAdminLayout";
import { AdminPermission } from "@/admin/types/admin.types";
import { useAdminAccess } from "@/hooks/useAdminAccess";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  requiredPermission?: AdminPermission;
}

export function AdminLayout({
  children,
  title = "Admin Dashboard",
  requiredPermission,
}: AdminLayoutProps) {
  const { hasAdminAccess } = useAdminAccess();

  if (!hasAdminAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2 max-w-md p-4">
          <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ImpulseAdminLayout title={title} requiresPermission={requiredPermission}>
      {children}
    </ImpulseAdminLayout>
  );
}
