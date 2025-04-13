
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Shield } from 'lucide-react';
import { RBACBridge } from '@/rbac/bridge';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  requiredPermission?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  requiredPermission
}) => {
  // If there's a required permission, check if the user has it
  if (requiredPermission && !RBACBridge.hasRole(['admin', 'superadmin'])) {
    return (
      <Card className="mx-auto my-8 max-w-2xl">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="flex items-center text-destructive">
            <Shield className="mr-2 h-6 w-6" />
            Access Denied
          </CardTitle>
          <CardDescription>
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p>Please contact your administrator if you believe this is an error.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto my-8 max-w-3xl">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-6 w-6 text-primary" />
          {title}
        </CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">
          This page is under development. Check back soon.
        </p>
      </CardContent>
    </Card>
  );
};
