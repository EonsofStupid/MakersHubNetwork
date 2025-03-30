
import React from "react";
import { Navigate } from "react-router-dom";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { AdminPermission } from "@/admin/types/admin.types";
import { useAdmin } from "@/admin/context/AdminContext";

// This component is now a wrapper around ImpulseAdminLayout for backward compatibility
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
  
  // If loading, show nothing (ImpulseAdminLayout will handle loading state)
  if (isLoading) {
    return null;
  }
  
  // Check if user has required permission
  if (!checkPermission(requiredPermission)) {
    return <Navigate to="/admin" replace />;
  }
  
  // Forward props to ImpulseAdminLayout
  return (
    <ImpulseAdminLayout title={title} requiresPermission={requiredPermission}>
      {children}
    </ImpulseAdminLayout>
  );
};
