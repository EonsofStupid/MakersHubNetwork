
import React from "react";
import { ShieldAlert } from "lucide-react";
import { PlaceholderPage } from "@/admin/routes/PlaceholderPage";
import { PERMISSIONS } from "@/auth/permissions";

export default function PermissionsPage() {
  return (
    <PlaceholderPage 
      title="Permissions Management" 
      description="Configure user roles and permissions across the platform." 
      icon={<ShieldAlert className="h-8 w-8 text-primary" />}
      requiredPermission={PERMISSIONS.SYSTEM_SETTINGS}
    />
  );
}
