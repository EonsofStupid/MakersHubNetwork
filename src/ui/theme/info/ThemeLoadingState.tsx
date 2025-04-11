
import React from 'react';
import { Loader } from 'lucide-react';

interface ThemeLoadingStateProps {
  message?: string;
  subMessage?: string;
}

export function ThemeLoadingState({ 
  message = "Loading theme...", 
  subMessage = "Preparing your visual experience" 
}: ThemeLoadingStateProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader className="h-10 w-10 animate-spin text-primary" />
        <div className="text-foreground font-medium">{message}</div>
        <p className="text-muted-foreground text-sm">{subMessage}</p>
      </div>
    </div>
  );
}
