
import React from 'react';
import { Layout } from '@/admin/types/layout.types';
import { LayoutRenderer } from '@/admin/components/layout/LayoutRenderer';
import { Skeleton } from '@/components/ui/skeleton';

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
  if (isLoading) {
    return (
      <div className={className}>
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  
  if (!layout) {
    return fallback ? (
      <div className={className}>{fallback}</div>
    ) : null;
  }
  
  return (
    <div className={className}>
      <LayoutRenderer layout={layout} />
    </div>
  );
}
