
import { useState, useEffect, useCallback } from 'react';
import { chatBridge } from '@/bridges/ChatBridge';
import { ChatMessage, ChatSession } from '@/bridges/ChatBridge';
import { useLogger } from '@/shared/hooks/use-logger';
import { LogCategory } from '@/logging/types';

interface UseChatSessionOptions {
  autoLoad?: boolean;
}

export function useChatSession(sessionId: string, options: UseChatSessionOptions = {}) {
  const { autoLoad = true } = options;
  
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const logger = useLogger(`ChatSession:${sessionId}`, LogCategory.CHAT);
  
  // Load session data
  const loadSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      logger.info('Loading chat session', { sessionId });
      
      // Load session details
      const sessionData = await chatBridge.getSession(sessionId);
      setSession(sessionData);
      
      // Load messages
      const messageData = await chatBridge.getMessages(sessionId);
      setMessages(messageData);
      
      logger.info('Chat session loaded', { 
        sessionId,
        messageCount: messageData.length 
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load chat session');
      logger.error('Error loading chat session', { error: error.message });
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, logger]);
  
  // Subscribe to new messages
  useEffect(() => {
    if (!sessionId) return;
    
    logger.debug('Subscribing to chat session', { sessionId });
    
    const unsubscribe = chatBridge.subscribeToSession(sessionId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      logger.debug('New message received', { messageId: newMessage.id });
    });
    
    return () => {
      logger.debug('Unsubscribing from chat session', { sessionId });
      unsubscribe();
    };
  }, [sessionId, logger]);
  
  // Auto-load session data
  useEffect(() => {
    if (autoLoad && sessionId) {
      loadSession();
    }
  }, [autoLoad, sessionId, loadSession]);
  
  // Send a new message
  const sendMessage = useCallback(async (content: string, metadata?: Record<string, any>) => {
    try {
      if (!sessionId) {
        throw new Error('Cannot send message: No active session');
      }
      
      logger.debug('Sending message', { sessionId, contentLength: content.length });
      const message = await chatBridge.sendMessage(sessionId, content, metadata);
      
      // Optimistically update the messages list
      setMessages(prev => [...prev, message]);
      
      return message;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message');
      logger.error('Error sending message', { error: error.message });
      throw error;
    }
  }, [sessionId, logger]);
  
  return {
    session,
    messages,
    isLoading,
    error,
    sendMessage,
    refreshSession: loadSession
  };
}
