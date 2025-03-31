import React from "react";
import { Card } from "@/components/ui/card";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { RequirePermission } from "@/admin/components/auth/RequirePermission";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  requiredPermission?: string;
}

export function PlaceholderPage({ 
  title, 
  description = "This feature is coming soon", 
  icon,
  requiredPermission 
}: PlaceholderPageProps) {
  const content = (
    <Card className="p-8 text-center">
      <div className="max-w-md mx-auto space-y-4">
        {icon && (
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  );

  // If permission is required, wrap in RequirePermission component
  if (requiredPermission) {
    return (
      <RequirePermission permission={requiredPermission}>
        <ImpulseAdminLayout title={title}>
          {content}
        </ImpulseAdminLayout>
      </RequirePermission>
    );
  }

  // Otherwise render without permission check
  return (
    <ImpulseAdminLayout title={title}>
      {content}
    </ImpulseAdminLayout>
  );
}
