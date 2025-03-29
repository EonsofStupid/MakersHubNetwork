
import React from "react";
import { Shield } from "lucide-react";
import { PlaceholderPage } from "@/admin/routes";

export default function PermissionsPage() {
  return (
    <PlaceholderPage 
      title="Permission Manager" 
      description="Configure user roles and permissions for the platform." 
      icon={<Shield className="h-8 w-8 text-primary" />}
      requiredPermission="super_admin:all"
    />
  );
}
