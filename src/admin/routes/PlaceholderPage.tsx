
import React from "react";
import { Shield } from "lucide-react";
import { Navigate } from "react-router-dom";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { cn } from "@/lib/utils";
import { useAdminPermissions } from "@/admin/hooks/useAdminPermissions";
import { AdminPermissionValue } from "@/admin/constants/permissions";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  requiredPermission?: AdminPermissionValue;
  className?: string;
}

export function PlaceholderPage({
  title,
  description,
  icon,
  requiredPermission,
  className,
}: PlaceholderPageProps) {
  const { hasPermission } = useAdminPermissions();

  // Redirect to unauthorized page if permission check fails
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return (
    <ImpulseAdminLayout title={title}>
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className
        )}
      >
        <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-[var(--impulse-primary)]/10 border border-[var(--impulse-primary)]/20">
          {icon || <Shield className="h-8 w-8 text-[var(--impulse-primary)]" />}
        </div>

        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-[var(--impulse-text-secondary)] max-w-md">
          {description}
        </p>

        <div className="mt-8 p-4 border border-[var(--impulse-border-normal)] rounded-md bg-[var(--impulse-bg-card)] w-full max-w-md">
          <p className="text-sm text-[var(--impulse-text-secondary)]">
            This section is under development. Check back soon for updates!
          </p>
        </div>
      </div>
    </ImpulseAdminLayout>
  );
}
