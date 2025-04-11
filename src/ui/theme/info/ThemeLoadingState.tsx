
import React from 'react';
import { Skeleton } from '@/ui/core/skeleton';

export function ThemeLoadingState() {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      
      <div className="space-y-2 py-4">
        <Skeleton className="h-[100px] w-full" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </div>
    </div>
  );
}
