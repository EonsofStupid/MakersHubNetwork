
import React, { useEffect, useState } from 'react';
import { useDebugStore } from '@/shared/store/debug.store';
import LogConsole from '@/logging/components/LogConsole';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

interface DebugControllerProps {
  children: React.ReactNode;
}

/**
 * Debug controller - loads early in bootstrap process to provide visibility
 * into system initialization and errors
 */
export function DebugController({ children }: DebugControllerProps) {
  const [showConsole, setShowConsole] = useState(false);
  const { isDebugMode, verboseLogging } = useDebugStore();
  
  // Set up keyboard shortcut for showing console: CTRL+SHIFT+L
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        setShowConsole(prev => !prev);
        logger.log(
          LogLevel.DEBUG, 
          LogCategory.DEBUG, 
          `Debug console ${!showConsole ? 'opened' : 'closed'} via keyboard shortcut`
        );
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Log that debug controller is ready
    logger.log(
      LogLevel.DEBUG, 
      LogCategory.SYSTEM, 
      'Debug controller initialized - Press CTRL+SHIFT+L to toggle console'
    );
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showConsole]);
  
  // Set verbose logging based on debug store
  useEffect(() => {
    logger.setMinLevel(verboseLogging ? LogLevel.DEBUG : LogLevel.INFO);
    logger.log(
      LogLevel.DEBUG, 
      LogCategory.DEBUG, 
      `Log level set to: ${verboseLogging ? 'DEBUG' : 'INFO'}`
    );
  }, [verboseLogging]);
  
  return (
    <>
      {children}
      {(isDebugMode || showConsole) && <LogConsole initialVisible={showConsole} onClose={() => setShowConsole(false)} />}
    </>
  );
}
