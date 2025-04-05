
import React from 'react';
import { Loader } from 'lucide-react';

export function ThemeLoadingState() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader className="h-10 w-10 animate-spin text-primary" />
        <div className="text-foreground font-medium">Loading theme...</div>
        <p className="text-muted-foreground text-sm">Preparing your visual experience</p>
      </div>
    </div>
  );
}
