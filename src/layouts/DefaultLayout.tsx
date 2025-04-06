
import React from 'react';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { useLoggingContext } from '@/logging/context/LoggingContext';
import { LogConsole } from '@/logging/components/LogConsole';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const { showLogConsole } = useLoggingContext();
  
  return (
    <div className="min-h-screen flex flex-col bg-[var(--impulse-bg-main)]">
      {/* Header could be added here */}
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer could be added here */}
      
      {/* Debug tools */}
      <LogToggleButton />
      {showLogConsole && <LogConsole />}
    </div>
  );
}
