
import { useState, useEffect, useCallback } from 'react';
import { useLogger } from '@/shared/hooks/useLogger';
import { LogCategory } from '@/shared/types/logging';
import { chatBridge, subscribeToChatEvents } from '@/chat/lib/ChatBridge';
import { ChatMessage, ChatSession } from '@/chat/types/bridge.types';

export function useChatSession(sessionId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const logger = useLogger('ChatSession', LogCategory.CHAT);
  
  // Fetch session data
  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('Fetching session', {
        details: { sessionId }
      });
      
      const sessionData = await chatBridge.getSession(sessionId);
      setSession(sessionData);
      
      // Messages are included in the session object
      setMessages(sessionData.messages || []);
      
      logger.debug('Session fetched successfully', {
        details: { sessionId }
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      logger.error('Failed to fetch session', {
        details: { error: error.message }
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, logger]);
  
  // Subscribe to session updates
  useEffect(() => {
    logger.debug('Setting up session subscription', {
      details: { sessionId }
    });
    
    const unsubscribe = subscribeToChatEvents((event) => {
      logger.debug('Chat event received', {
        details: { type: event.type }
      });
      
      // Only process events for this session
      if (event.sessionId === sessionId) {
        if (event.type === 'MESSAGE_SENT' || event.type === 'MESSAGE_RECEIVED') {
          setMessages(prevMessages => [...prevMessages, event.payload]);
        }
      }
    });
    
    // Initial fetch
    fetchSession();
    
    return () => {
      unsubscribe();
    };
  }, [sessionId, fetchSession, logger]);
  
  // Send message helper
  const sendMessage = useCallback(async (content: string) => {
    logger.info('Sending message', {
      details: { sessionId }
    });
    
    try {
      const message = await chatBridge.sendMessage(sessionId, content, 'user');
      return message;
    } catch (err) {
      const error = err as Error;
      logger.error('Failed to send message', {
        details: { error: error.message }
      });
      throw error;
    }
  }, [sessionId, logger]);
  
  return {
    isLoading,
    error,
    session,
    messages,
    sendMessage,
    refreshSession: fetchSession
  };
}
