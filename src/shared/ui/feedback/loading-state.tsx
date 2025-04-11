
import React from 'react';
import { Skeleton } from '@/shared/ui/core/skeleton';

interface LoadingStateProps {
  rows?: number;
  showHeader?: boolean;
  variant?: 'default' | 'card' | 'list';
}

export function LoadingState({ 
  rows = 5, 
  showHeader = true, 
  variant = 'default' 
}: LoadingStateProps) {
  const renderDefault = () => (
    <div className="space-y-4">
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      )}

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );

  const renderCard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-3">
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-4 w-[180px]" />
          <Skeleton className="h-24 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[60px]" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="space-y-2">
      {showHeader && (
        <div className="flex border-b pb-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px] ml-auto" />
        </div>
      )}
      
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center py-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-[200px] ml-3" />
          <Skeleton className="h-4 w-[100px] ml-auto" />
        </div>
      ))}
    </div>
  );

  switch (variant) {
    case 'card': return renderCard();
    case 'list': return renderList();
    default: return renderDefault();
  }
}

/**
 * ContentLoader component to show skeleton loading state for content
 */
export function ContentLoader({
  className,
  lines = 3,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Skeleton className="h-4 w-[70%]" />
      {Array.from({ length: lines - 1 }, (_, i) => (
        <Skeleton key={i} className={`h-4 w-[${Math.floor(Math.random() * 30) + 60}%]`} />
      ))}
    </div>
  );
}

/**
 * TableLoader component to show skeleton loading state for tables
 */
export function TableLoader({
  className,
  rows = 5,
  columns = 4,
}: {
  className?: string;
  rows?: number;
  columns?: number;
}) {
  return (
    <div className={`w-full overflow-hidden rounded-lg border border-border ${className || ''}`}>
      <div className="bg-muted/50 p-3">
        <div className="flex items-center gap-4">
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton key={i} className={`h-4 w-[${Math.floor(Math.random() * 20) + 70}px]`} />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 p-3">
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                className={`h-4 w-[${Math.floor(Math.random() * 50) + 50}px]`} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
