import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatSession, ChatMode } from '@/shared/types/core/chat.types';
import { LogCategory, LogLevel } from '@/shared/types/core/logging.types';
import { logger } from '@/logging/logger.service';

interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  setCurrentSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  createSession: (title?: string) => string;
  saveMessage: (message: Omit<ChatMessage, 'id'>) => ChatMessage | null;
  getCurrentSession: () => ChatSession | null;
  isChatEnabled?: boolean;
}

const ChatContext = createContext<ChatContextType>({
  sessions: [],
  currentSessionId: null,
  setCurrentSessionId: () => {},
  createSession: () => '',
  saveMessage: () => null,
  getCurrentSession: () => null,
  isChatEnabled: true
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isChatEnabled] = useState<boolean>(true);

  const createSession = (title = 'New Chat') => {
    const now = new Date().toISOString();
    const sessionId = uuidv4();
    const newSession: ChatSession = {
      id: sessionId,
      title,
      messages: [],
      mode: 'chat',
      createdAt: now,
      updatedAt: now,
      created_at: now,
      updated_at: now
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(sessionId);
    
    logger.log(LogLevel.INFO, LogCategory.CHAT, 'Created new chat session', {
      sessionId
    });
    
    return sessionId;
  };

  const saveMessage = (message: Omit<ChatMessage, 'id'>) => {
    if (!currentSessionId) return null;
    
    const now = new Date().toISOString();
    const newMessage: ChatMessage = {
      ...message,
      id: uuidv4(),
      created_at: now,
      updated_at: now
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

export const useChatContext = () => useContext(ChatContext);
