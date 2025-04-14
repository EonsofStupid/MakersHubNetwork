
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatBridge } from '../lib/ChatBridge';
import { ChatMessage, ChatSession, LogCategory, LogLevel } from '@/shared/types';
import { logger } from '@/logging/logger.service';

// Define the chat context type
interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  setCurrentSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  createSession: (title?: string) => string;
  saveMessage: (message: Omit<ChatMessage, 'id'>) => ChatMessage | null;
  getCurrentSession: () => ChatSession | null;
  isChatEnabled?: boolean;
}

// Create context with default values
const ChatContext = createContext<ChatContextType>({
  sessions: [],
  currentSessionId: null,
  setCurrentSessionId: () => {},
  createSession: () => '',
  saveMessage: () => null,
  getCurrentSession: () => null,
  isChatEnabled: true
});

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isChatEnabled] = useState<boolean>(true);

  // Create a new chat session
  const createSession = (title = 'New Chat') => {
    const sessionId = uuidv4();
    const newSession: ChatSession = {
      id: sessionId,
      title,
      messages: [],
      mode: 'chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(sessionId);
    
    logger.log(LogLevel.INFO, LogCategory.CHAT, 'Created new chat session', {
      sessionId
    });
    
    return sessionId;
  };
  
  // Save a message to the current session
  const saveMessage = (message: Omit<ChatMessage, 'id'>) => {
    if (!currentSessionId) return null;
    
    const newMessage: ChatMessage = {
      ...message,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId
        ? { 
            ...session, 
            messages: [...session.messages, newMessage],
            updatedAt: Date.now(),
            updated_at: new Date().toISOString()
          }
        : session
    ));
    
    return newMessage;
  };
  
  // Get the current session
  const getCurrentSession = () => {
    if (!currentSessionId) return null;
    return sessions.find(session => session.id === currentSessionId) || null;
  };

  return (
    <ChatContext.Provider 
      value={{ 
        sessions, 
        currentSessionId, 
        setCurrentSessionId,
        createSession,
        saveMessage,
        getCurrentSession,
        isChatEnabled
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for using the chat context
export const useChatContext = () => useContext(ChatContext);
