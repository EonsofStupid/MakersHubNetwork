
import React from 'react';
import { Loader } from 'lucide-react';

export const ThemeLoadingState: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader size={48} className="animate-spin text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
          </div>
        </div>
        <h2 className="text-xl font-bold">Loading Theme System</h2>
        <p className="text-muted-foreground">Initializing visual components...</p>
      </div>
    </div>
  );
};
