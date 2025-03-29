
import React from "react";
import { Card } from "@/components/ui/card";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";

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
  return (
    <ImpulseAdminLayout 
      title={title}
      requiresPermission={requiredPermission as any}
    >
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
    </ImpulseAdminLayout>
  );
}
