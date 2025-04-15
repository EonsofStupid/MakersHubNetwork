
import React, { useState } from 'react';
import { Loader2, Activity, BrainCircuit, AlertTriangle, ListFilter } from 'lucide-react';
import { Progress } from '@/shared/ui/progress';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/ui/button';
import { useDebugStore } from '@/shared/store/debug.store';
import LogConsole from '@/logging/components/LogConsole';

interface CyberLoadingScreenProps {
  message?: string;
  subMessage?: string;
  progress?: number;
  className?: string;
  errorDetails?: Error | null;
  onRetry?: () => void;
  showConsoleToggle?: boolean;
}

export function CyberLoadingScreen({
  message = "System Initialization",
  subMessage = "Loading core modules...",
  progress = 0,
  className,
  errorDetails,
  onRetry,
  showConsoleToggle = false
}: CyberLoadingScreenProps) {
  const [showConsole, setShowConsole] = useState(false);
  const { isDebugMode, toggleDebugMode } = useDebugStore();
  
  const hasError = !!errorDetails;
  
  return (
    <div className={cn(
      "fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center z-50",
      "cyber-background",
      className
    )}>
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="relative flex justify-center">
          {hasError ? (
            <AlertTriangle className="h-16 w-16 text-destructive animate-pulse" />
          ) : (
            <>
              <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
              <Activity className="absolute h-24 w-24 text-primary/20 animate-spin-slow" />
            </>
          )}
        </div>
        
        <div className="space-y-6 text-center">
          <h2 className={cn(
            "cyber-text text-2xl font-bold tracking-wider",
            hasError && "text-destructive"
          )}>
            {message}
          </h2>
          
          <div className="space-y-4">
            <Progress value={progress} className={cn(
              "cyber-glow h-2",
              hasError && "bg-destructive/20"
            )} />
            <p className="text-muted-foreground text-sm animate-pulse">
              {subMessage}
            </p>
          </div>
          
          {hasError && onRetry && (
            <div className="mt-4 space-y-4">
              <div className="p-2 bg-card/30 rounded-md text-xs text-left max-h-24 overflow-auto">
                <pre className="whitespace-pre-wrap text-destructive/80">
                  {errorDetails.message}
                  {errorDetails.stack && (
                    <>
                      <br /><br />
                      <span className="text-muted-foreground text-[10px]">
                        {errorDetails.stack.split('\n').slice(0, 3).join('\n')}
                      </span>
                    </>
                  )}
                </pre>
              </div>
              <Button 
                onClick={onRetry} 
                variant="destructive"
                className="w-full"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Retry System Initialization
              </Button>
            </div>
          )}
          
          {!hasError && (
            <div className="flex justify-center gap-2">
              <span className="h-2 w-2 bg-primary rounded-full animate-ping" />
              <span className="h-2 w-2 bg-primary/80 rounded-full animate-ping delay-75" />
              <span className="h-2 w-2 bg-primary/60 rounded-full animate-ping delay-150" />
            </div>
          )}
          
          {showConsoleToggle && (
            <div className="mt-4 pt-4 border-t border-border/30">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs"
                onClick={() => setShowConsole(prev => !prev)}
              >
                <ListFilter className="w-4 h-4 mr-1" />
                {showConsole ? 'Hide' : 'Show'} System Logs
              </Button>
              {!isDebugMode && (
                <Button 
                  variant="link" 
                  size="sm"
                  className="text-xs ml-2"
                  onClick={toggleDebugMode}
                >
                  Enable Debug Mode
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {showConsole && <LogConsole initialVisible={true} onClose={() => setShowConsole(false)} />}
    </div>
  );
}
