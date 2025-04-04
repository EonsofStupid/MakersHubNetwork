import React, { useEffect } from 'react';
import { Layout } from '@/admin/types/layout.types';
import { LayoutRenderer } from '@/admin/components/layout/LayoutRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface CoreLayoutRendererProps {
  layout: Layout | null;
  isLoading: boolean;
  fallback?: React.ReactNode;
  className?: string;
  id?: string;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
      <p className="font-medium">Layout rendering error:</p>
      <p className="mt-1 text-sm">{error.message}</p>
    </div>
  );
}

export function CoreLayoutRenderer({ 
  layout, 
  isLoading, 
  fallback, 
  className,
  id
}: CoreLayoutRendererProps) {
  const logger = useLogger('CoreLayoutRenderer', { category: LogCategory.UI });
  
  // Render a proper loading skeleton
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className || ''}`} data-layout-loading={id || true}>
        <Skeleton className="h-8 w-full max-w-sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  // Skip rendering with minimal logging if no layout
  if (!layout) {
    if (fallback) {
      return <div className={className} data-layout-missing={id || true}>{fallback}</div>;
    }
    logger.warn('No layout and no fallback provided', { details: { id } });
    return null;
  }

  // Skip empty layouts
  if (!layout?.components?.length) {
    logger.debug('Layout has no components', { details: { layoutId: layout?.id, type: layout?.type } });
    return fallback ? (
      <div className={className} data-layout-empty={id || true}>
        {fallback}
      </div>
    ) : null;
  }
  
  // Render the actual layout with error boundary
  logger.debug('Rendering layout', { details: { layoutId: layout.id, type: layout.type, componentCount: layout.components.length } });
  return (
    <div className={className} data-layout-id={layout.id} data-layout-type={layout.type}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error) => {
          logger.error('Error rendering layout', { 
            details: { 
              error: error.message,
              layoutId: layout.id,
              type: layout.type
            } 
          });
        }}
        resetKeys={[layout.id]}
      >
        <LayoutRenderer layout={layout} />
      </ErrorBoundary>
    </div>
  );
}
