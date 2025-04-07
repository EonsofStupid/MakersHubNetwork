
import React, { createContext, useContext, useState } from 'react';
import { ChatContext, ChatMode } from '../types/chat-context';

const DevChatContext = createContext<ChatContext | null>(null);

export const useDevChat = (): ChatContext => {
  const context = useContext(DevChatContext);
  if (context === null) {
    throw new Error('useDevChat must be used within a DevChatProvider');
  }
  return context;
};

interface DevChatProviderProps {
  children: React.ReactNode;
}

export const DevChatProvider: React.FC<DevChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState("");
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [mode, setMode] = useState<ChatMode>('dev');
  
  const loadContext = async (query: string): Promise<string> => {
    setIsLoadingContext(true);
    try {
      // Simulate loading context
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newContext = `Development context for: ${query}`;
      setContext(newContext);
      return newContext;
    } finally {
      setIsLoadingContext(false);
    }
  };
  
  const sendMessage = async (content: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate sending a message
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add user message
      const userMessage = { 
        id: Date.now().toString(),
        role: 'user', 
        content 
      };
      
      // Simulate AI response
      const aiMessage = { 
        id: (Date.now() + 1).toString(),
        role: 'assistant', 
        content: `Development mode response to: "${content}"` 
      };
      
      setMessages(prev => [...prev, userMessage, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const value: ChatContext = {
    context,
    loadContext,
    isLoadingContext,
    messages,
    sendMessage,
    isLoading,
    mode
  };
  
  return (
    <DevChatContext.Provider value={value}>
      {children}
    </DevChatContext.Provider>
  );
};
