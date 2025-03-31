
import React from "react";
import { Shield } from "lucide-react";
import { PlaceholderPage } from "@/admin/routes";
import { ADMIN_PERMISSIONS } from "@/admin/constants/permissions";

export default function PermissionsPage() {
  return (
    <PlaceholderPage 
      title="Permission Manager" 
      description="Configure user roles and permissions for the platform." 
      icon={<Shield className="h-8 w-8 text-primary" />}
      requiredPermission={ADMIN_PERMISSIONS.SUPER_ADMIN}
    />
  );
}
