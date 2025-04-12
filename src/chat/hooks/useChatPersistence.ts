
import { useCallback, useState } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'system' | 'assistant';
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: number;
  createdAt: number;
}

/**
 * Hook for chat persistence functionality
 */
export function useChatPersistence() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  /**
   * Create a new chat session
   */
  const createSession = useCallback((title: string = 'New Chat') => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title,
      messages: [],
      lastUpdated: Date.now(),
      createdAt: Date.now()
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    
    return newSession.id;
  }, []);
  
  /**
   * Save a message to the current session
   */
  const saveMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!currentSessionId) return null;
    
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: Date.now()
    };
    
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages: [...session.messages, newMessage],
          lastUpdated: Date.now()
        };
      }
      return session;
    }));
    
    return newMessage;
  }, [currentSessionId]);
  
  /**
   * Get the current session
   */
  const getCurrentSession = useCallback(() => {
    return sessions.find(session => session.id === currentSessionId) || null;
  }, [currentSessionId, sessions]);
  
  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    saveMessage,
    getCurrentSession
  };
}

export default useChatPersistence;
