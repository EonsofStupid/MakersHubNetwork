
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatSession, LogCategory } from '@/shared/types';
import { useLogger } from '@/logging/hooks/use-logger';

/**
 * Hook for managing chat sessions
 */
export function useChatSession() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const logger = useLogger('useChatSession', LogCategory.CHAT);

  // Create a new session
  const createSession = useCallback((title?: string) => {
    const sessionId = uuidv4();
    const newSession: ChatSession = {
      id: sessionId,
      title: title || `New Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(sessionId);
    logger.debug(`Created new chat session: ${sessionId}`);
    
    return sessionId;
  }, [sessions.length, logger]);

  // Save a message to the current session
  const saveMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!currentSessionId) {
      logger.warn('No active session to save message');
      return null;
    }
    
    const newMessage: ChatMessage = {
      ...message,
      id: uuidv4(),
      timestamp: Date.now()
    };
    
    setSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, newMessage],
              updatedAt: Date.now()
            }
          : session
      )
    );
    
    logger.debug(`Saved message to session: ${currentSessionId.substring(0, 6)}...`);
    return newMessage;
  }, [currentSessionId, logger]);

  // Get the current session
  const getCurrentSession = useCallback(() => {
    if (!currentSessionId) return null;
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
