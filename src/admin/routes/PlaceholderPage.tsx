
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

interface PlaceholderPageProps {
  title: string;
  description: string;
  requiredPermission?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  requiredPermission
}) => {
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder page for the {title.toLowerCase()} section.
            {requiredPermission && (
              <> This page requires the <code>{requiredPermission}</code> permission.</>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
