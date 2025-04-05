
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoggingContextType {
  showLogConsole: boolean;
  toggleLogConsole: () => void;
}

const LoggingContext = createContext<LoggingContextType>({
  showLogConsole: false,
  toggleLogConsole: () => {},
});

interface LoggingProviderProps {
  children: ReactNode;
}

export function LoggingProvider({ children }: LoggingProviderProps) {
  const [showLogConsole, setShowLogConsole] = useState(false);

  const toggleLogConsole = () => {
    setShowLogConsole(prev => !prev);
  };

  return (
    <LoggingContext.Provider value={{ showLogConsole, toggleLogConsole }}>
      {children}
    </LoggingContext.Provider>
  );
}

export const useLoggingContext = () => useContext(LoggingContext);
