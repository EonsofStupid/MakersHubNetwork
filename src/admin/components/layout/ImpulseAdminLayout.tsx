
/**
 * DEPRECATED: This component is kept for backward compatibility.
 * Please use AdminLayout directly from @/admin/components/AdminLayout
 */

import React from "react";
import { AdminLayout } from "@/admin/components/AdminLayout";
import { AdminPermission } from "@/admin/types/admin.types";

interface ImpulseAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  requiresPermission?: AdminPermission;
}

export const ImpulseAdminLayout: React.FC<ImpulseAdminLayoutProps> = ({
  children,
  title = "Admin Panel",
  requiresPermission = "admin:access"
}) => {
  return (
    <AdminLayout
      title={title}
      requiredPermission={requiresPermission}
    >
      {children}
    </AdminLayout>
  );
};

export default ImpulseAdminLayout;
