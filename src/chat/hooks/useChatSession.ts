
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';
import { ChatMessage, ChatSession } from '@/shared/types/core/chat.types';

/**
 * Hook for managing chat sessions
 */
export function useChatSession() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const logger = useLogger('useChatSession', LogCategory.CHAT);
  
  const createSession = useCallback((title?: string) => {
    const now = new Date().toISOString();
    const sessionId = uuidv4();
    const newSession: ChatSession = {
      id: sessionId,
      title: title || `Chat ${new Date().toLocaleString()}`,
      messages: [],
      mode: 'chat',
      createdAt: now,
      updatedAt: now,
      created_at: now,
      updated_at: now
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(sessionId);
    logger.info('New chat session created', { details: { sessionId } });
    
    return sessionId;
  }, [logger]);
  
  const saveMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    if (!currentSessionId) {
      logger.warn('Attempted to save message but no active session');
      return null;
    }
    
    const now = new Date().toISOString();
    const newMessage: ChatMessage = {
      id: uuidv4(),
      ...message,
      created_at: message.created_at || now,
      updated_at: message.updated_at || now
    };
    
    setSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, newMessage],
              updatedAt: now,
              updated_at: now
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
      const now = new Date().toISOString();
      saveMessage({
        content,
        sender: 'user',
        created_at: now,
        updated_at: now
      });
      
      // Mock AI response
      setTimeout(() => {
        const responseTime = new Date().toISOString();
        saveMessage({
          content: 'This is a mock response. Real AI implementation pending.',
          sender: 'ai',
          created_at: responseTime,
          updated_at: responseTime
        });
      }, 1000);
    },
    isLoading: false
  };
}
