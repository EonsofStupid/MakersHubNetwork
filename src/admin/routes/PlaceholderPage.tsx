
import React from 'react';
import { AdminPermissionValue } from '@/admin/types/permissions';
import { RequirePermission } from '@/admin/components/auth/RequirePermission';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  requiredPermission?: AdminPermissionValue;
}

export function PlaceholderPage({
  title,
  description,
  icon,
  requiredPermission
}: PlaceholderPageProps) {
  const logger = useLogger('PlaceholderPage', LogCategory.ADMIN);
  
  // Log the page view for debugging
  React.useEffect(() => {
    logger.info(`Placeholder page viewed: ${title}`);
  }, [title, logger]);
  
  // Wrap in permission check if required
  const content = (
    <div className="container py-6 space-y-6">
      <header className="flex items-center gap-3">
        {icon}
        <div>
          <h1 className="text-2xl font-heading">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </header>
      
      <div className="h-96 flex flex-col items-center justify-center border border-dashed border-muted-foreground/30 rounded-md p-8">
        <div className="text-center max-w-xl">
          <h2 className="text-xl font-heading mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            This feature is currently in development. Check back later for updates.
          </p>
        </div>
      </div>
    </div>
  );
  
  if (requiredPermission) {
    return (
      <RequirePermission permission={requiredPermission}>
        {content}
      </RequirePermission>
    );
  }
  
  return content;
}
