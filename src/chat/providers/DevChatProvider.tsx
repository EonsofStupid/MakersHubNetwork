
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DevChatContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const DevChatContext = createContext<DevChatContextType | null>(null);

export const DevChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<string>("standard");

  return (
    <DevChatContext.Provider value={{ mode, setMode }}>
      {children}
    </DevChatContext.Provider>
  );
};

export const useDevChat = () => {
  const context = useContext(DevChatContext);
  
  if (context === null) {
    throw new Error("useDevChat must be used within a DevChatProvider");
  }
  
  return context;
};
