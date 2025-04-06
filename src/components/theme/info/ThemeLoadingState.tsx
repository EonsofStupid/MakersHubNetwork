
import React from 'react';
import { Loader } from 'lucide-react';

interface ThemeLoadingStateProps {
  message?: string;
  subMessage?: string;
  showSpinner?: boolean;
}

export function ThemeLoadingState({
  message = 'Loading theme...',
  subMessage = 'Please wait while we prepare the interface',
  showSpinner = true
}: ThemeLoadingStateProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="text-center bg-card p-8 rounded-lg border border-border shadow-lg flex flex-col items-center gap-4">
        {showSpinner && (
          <Loader className="animate-spin h-12 w-12 text-primary" />
        )}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-primary">{message}</h3>
          <p className="text-muted-foreground">{subMessage}</p>
        </div>
      </div>
    </div>
  );
}
