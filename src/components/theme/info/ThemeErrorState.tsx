
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function ThemeErrorState({ error, onRetry }: ThemeErrorStateProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 rounded-lg border border-destructive/30 bg-card shadow-lg">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">Theme Loading Error</h2>
          <p className="text-muted-foreground">
            There was an error loading the application theme. Using the fallback theme for now.
          </p>
          
          <div className="w-full p-2 bg-muted rounded-md overflow-auto my-2 text-left">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
              {error.message}
            </pre>
          </div>
          
          <Button 
            onClick={onRetry} 
            className="cyber-effect-text site-border-glow mt-2 w-full"
          >
            Retry Loading Theme
          </Button>
        </div>
      </div>
    </div>
  );
}
