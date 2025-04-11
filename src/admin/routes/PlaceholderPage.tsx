
import React, { ReactNode } from "react";
import { ADMIN_PERMISSIONS } from "@/admin/constants/permissions";
import { RequirePermission } from "@/admin/components/auth/RequirePermission";
import { Card, CardContent, CardFooter } from '@/ui/core/card';
import { Button } from '@/ui/core/button';
import { AdminPermissionValue } from "@/admin/types/permissions";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: ReactNode;
  requiredPermission?: AdminPermissionValue;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
}

export function PlaceholderPage({ 
  title, 
  description, 
  icon,
  requiredPermission = ADMIN_PERMISSIONS.ADMIN_VIEW,
  ctaText,
  ctaLink,
  onCtaClick
}: PlaceholderPageProps) {
  const content = (
    <div className="py-12">
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
            {icon}
          </div>
          <h2 className="text-2xl font-heading mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
        </CardContent>
        {(ctaText || ctaLink || onCtaClick) && (
          <CardFooter className="flex justify-center pb-6">
            {ctaLink ? (
              <Button asChild>
                <a href={ctaLink}>{ctaText || "Learn More"}</a>
              </Button>
            ) : (
              <Button onClick={onCtaClick}>{ctaText || "Learn More"}</Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );

  // If a permission is required, wrap the content with RequirePermission
  if (requiredPermission) {
    return (
      <RequirePermission permission={requiredPermission}>
        {content}
      </RequirePermission>
    );
  }

  return content;
}
