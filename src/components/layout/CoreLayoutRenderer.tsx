
import React from 'react';
import { Layout } from '@/admin/types/layout.types';
import { LayoutRenderer } from '@/admin/components/layout/LayoutRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface CoreLayoutRendererProps {
  layout: Layout | null;
  isLoading: boolean;
  fallback?: React.ReactNode;
  className?: string;
}

export function CoreLayoutRenderer({ 
  layout, 
  isLoading, 
  fallback, 
  className 
}: CoreLayoutRendererProps) {
  const logger = useLogger('CoreLayoutRenderer', LogCategory.UI);
  
  if (isLoading) {
    return (
      <div className={className}>
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  
  if (!layout) {
    logger.warn('Layout not found, using fallback', {
      details: { hasLayout: !!layout, hasFallback: !!fallback }
    });
    return fallback ? (
      <div className={className}>{fallback}</div>
    ) : null;
  }
  
  try {
    return (
      <div className={className}>
        <LayoutRenderer layout={layout} />
      </div>
    );
  } catch (error) {
    logger.error('Error rendering layout', { details: error });
    return fallback ? (
      <div className={className}>{fallback}</div>
    ) : (
      <div className="p-4 text-destructive">Layout rendering error</div>
    );
  }
}
