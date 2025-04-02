
import React, { useEffect } from 'react';
import { Layout } from '@/admin/types/layout.types';
import { LayoutRenderer } from '@/admin/components/layout/LayoutRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

interface CoreLayoutRendererProps {
  layout: Layout | null;
  isLoading: boolean;
  fallback?: React.ReactNode;
  className?: string;
  id?: string;
}

export function CoreLayoutRenderer({ 
  layout, 
  isLoading, 
  fallback, 
  className,
  id
}: CoreLayoutRendererProps) {
  const logger = useLogger('CoreLayoutRenderer', LogCategory.UI);
  
  // Skip rendering with minimal logging if no layout
  if (!layout && !isLoading) {
    if (fallback) {
      return <div className={className} data-layout-missing={id || true}>{fallback}</div>;
    }
    return null;
  }

  // Render a simple skeleton for loading state
  if (isLoading) {
    return (
      <div className={className} data-layout-loading={id || true}>
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  
  // Skip empty layouts
  if (!layout?.components?.length) {
    return fallback ? (
      <div className={className} data-layout-empty={id || true}>
        {fallback}
      </div>
    ) : null;
  }
  
  // Render the actual layout
  try {
    return (
      <div className={className} data-layout-id={layout.id} data-layout-type={layout.type}>
        <LayoutRenderer layout={layout} />
      </div>
    );
  } catch (error) {
    logger.error('Error rendering layout', { details: safeDetails(error) });
    
    return fallback ? (
      <div className={className} data-layout-error={id || true}>
        {fallback}
      </div>
    ) : (
      <div className="p-4 text-destructive" data-layout-error={id || true}>
        Layout rendering error
      </div>
    );
  }
}
