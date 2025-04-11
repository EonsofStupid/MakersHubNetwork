
import React from 'react';
import { Terminal } from 'lucide-react';
import { Button } from '@/ui/core/button';
import { useLoggingContext } from '../context/LoggingContext';
import { cn } from '@/lib/utils';

export const LogToggleButton: React.FC = () => {
  const { showLogConsole, setShowLogConsole } = useLoggingContext();
  
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed bottom-4 right-4 z-20 rounded-full w-10 h-10 border-primary/30 shadow-md",
        "hover:bg-primary/20 hover:border-primary/50 transition-all",
        "group backdrop-blur-sm bg-background/60",
        showLogConsole && "bg-primary/20 border-primary/50"
      )}
      onClick={() => setShowLogConsole(!showLogConsole)}
      title={showLogConsole ? "Hide Log Console" : "Show Log Console"}
    >
      <Terminal 
        className={cn(
          "h-4 w-4 text-primary group-hover:animate-pulse",
          showLogConsole && "animate-pulse"
        )} 
      />
    </Button>
  );
};
