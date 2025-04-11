
import React from 'react';
import { Skeleton } from '@/ui/core/skeleton';

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
        <div key={i} className="border rounded-lg p-4 space-y-3">
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
