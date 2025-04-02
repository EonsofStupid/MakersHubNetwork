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
  
  // Log when layout changes
  useEffect(() => {
    if (layout) {
      logger.debug('Layout loaded', { 
        details: { 
          id: layout.id, 
          type: layout.type, 
          componentsCount: layout.components?.length || 0 
        } 
      });
    }
  }, [layout, logger]);
  
  if (isLoading) {
    logger.debug('Rendering loading state', { details: { id } });
    return (
      <div className={className} data-layout-loading={id || true}>
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  
  if (!layout) {
    logger.warn('Layout not found, using fallback', {
      details: { hasLayout: !!layout, hasFallback: !!fallback, id }
    });
    return fallback ? (
      <div className={className} data-layout-missing={id || true}>
        {fallback}
      </div>
    ) : null;
  }
  
  try {
    logger.debug('Rendering layout', { 
      details: { id: layout.id, type: layout.type } 
    });
    
    return (
      <div className={className} data-layout-id={layout.id} data-layout-type={layout.type}>
        <LayoutRenderer layout={layout} />
      </div>
    );
  } catch (error) {
    logger.error('Error rendering layout', { details: safeDetails(error) });
    console.error('Layout rendering error:', error);
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
