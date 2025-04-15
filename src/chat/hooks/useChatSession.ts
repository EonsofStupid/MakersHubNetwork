
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory, ChatMessage, ChatSession } from '@/shared/types';

/**
 * Hook for managing chat sessions
 */
export function useChatSession() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const logger = useLogger('useChatSession', LogCategory.CHAT);
  
  const createSession = useCallback((title?: string) => {
    const sessionId = uuidv4();
    const newSession: ChatSession = {
      id: sessionId,
      title: title || `Chat ${new Date().toLocaleString()}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(sessionId);
    logger.info('New chat session created', { details: { sessionId } });
    
    return sessionId;
  }, [logger]);
  
  const saveMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!currentSessionId) {
      logger.warn('Attempted to save message but no active session');
      return null;
    }
    
    const newMessage: ChatMessage = {
      id: uuidv4(),
      ...message,
      timestamp: Date.now(),
      created_at: message.created_at || new Date().toISOString(),
      updated_at: message.updated_at || new Date().toISOString()
    };
    
    setSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, newMessage],
              updatedAt: Date.now(),
              updated_at: new Date().toISOString()
            }
          : session
      )
    );
    
    logger.debug('Message saved to session', { 
      details: { 
        sessionId: currentSessionId, 
        messageId: newMessage.id,
        sender: message.sender
      } 
    });
    
    return newMessage;
  }, [currentSessionId, logger]);
  
  const getCurrentSession = useCallback((): ChatSession | null => {
    return sessions.find(session => session.id === currentSessionId) || null;
  }, [sessions, currentSessionId]);
  
  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    saveMessage,
    getCurrentSession,
    isChatEnabled: true, // Temporary - later will be from config
    messages: getCurrentSession()?.messages || [],
    sendMessage: async (content: string) => {
      saveMessage({
        content,
        sender: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      // Mock AI response
      setTimeout(() => {
        saveMessage({
          content: 'This is a mock response. Real AI implementation pending.',
          sender: 'ai',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }, 1000);
    },
    isLoading: false
  };
}
