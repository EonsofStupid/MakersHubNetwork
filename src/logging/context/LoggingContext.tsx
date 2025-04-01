
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLogger } from '../index';
import { LogLevel, LogCategory, LogEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface LoggingContextType {
  showLogConsole: boolean;
  setShowLogConsole: (show: boolean) => void;
  logSystemStartup: () => void;
  logs: LogEntry[];
  clearLogs: () => void;
  toggleLogConsole: () => void;
}

const LoggingContext = createContext<LoggingContextType>({
  showLogConsole: false,
  setShowLogConsole: () => {},
  logSystemStartup: () => {},
  logs: [],
  clearLogs: () => {},
  toggleLogConsole: () => {}
});

export const useLoggingContext = () => useContext(LoggingContext);

export const LoggingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLogConsole, setShowLogConsole] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logger = getLogger();
  
  // Toggle log console
  const toggleLogConsole = useCallback(() => {
    setShowLogConsole(prev => !prev);
  }, []);
  
  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);
  
  // Log system startup
  const logSystemStartup = useCallback(() => {
    logger.info('Application UI initialized', {
      category: LogCategory.SYSTEM,
      details: {
        environment: import.meta.env.MODE,
        timestamp: new Date().toISOString(),
      },
      tags: ['startup', 'initialization']
    });
  }, [logger]);
  
  // Listen for log events
  useEffect(() => {
    const handleLogEvent = (entry: LogEntry) => {
      setLogs(prevLogs => [...prevLogs, {
        ...entry,
        id: entry.id || uuidv4()
      }]);
    };
    
    // Add listener for log events
    // This is a simplified version - in a real app we'd need to implement
    // a proper event system for the logger
    const unsubscribe = subscribeToLogEvents(handleLogEvent);
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Listen for key combinations to toggle log console (Ctrl+Shift+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        toggleLogConsole();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleLogConsole]);
  
  return (
    <LoggingContext.Provider value={{ 
      showLogConsole, 
      setShowLogConsole,
      logSystemStartup,
      logs,
      clearLogs,
      toggleLogConsole
    }}>
      {children}
    </LoggingContext.Provider>
  );
};

// Helper function to subscribe to log events
// This is a placeholder - in a real app we'd implement a proper event system
function subscribeToLogEvents(callback: (entry: LogEntry) => void): () => void {
  // Implementation would depend on how the logging system emits events
  return () => {};
}
