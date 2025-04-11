
import { useState, useEffect } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { ChatBridge } from '@/bridges/ChatBridge';
import { useLogger } from '@/ui/hooks/useLogger';
import { LogCategory } from '@/logging';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/shared.types';
import { CircuitBreaker } from '@/utils/CircuitBreaker';

interface UseChatSessionProps {
  sessionId?: string;
  mode?: 'normal' | 'dev' | 'admin';
}

export function useChatSession({ sessionId: externalSessionId, mode = 'normal' }: UseChatSessionProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>(externalSessionId || '');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthState();
  const logger = useLogger('useChatSession', LogCategory.CHAT);
  const chatBreaker = new CircuitBreaker('useChatSession', 5, 1000);
  
  useEffect(() => {
    // Prevent potential infinite loops with circuit breaker
    if (chatBreaker.count('init') > 3) {
      logger.warn('Breaking potential infinite loop in useChatSession initialization');
      return;
    }
    
    if (externalSessionId) {
      setSessionId(externalSessionId);
    } else if (!sessionId) {
      // Generate new session ID if none provided
      const newSessionId = ChatBridge.createSession({
        userId: user?.id,
        mode,
        metadata: { source: 'useChatSession' }
      });
      
      setSessionId(newSessionId);
      
      logger.info('Created new chat session', {
        details: { sessionId: newSessionId, mode }
      });
    }
  }, [externalSessionId, sessionId, user?.id, logger, mode]);
  
  useEffect(() => {
    if (!sessionId) return;
    
    // Subscribe to session events via the bridge
    const unsubscribe = ChatBridge.subscribeToSession(sessionId, (event) => {
      if (event.type === 'new-message' && event.message) {
        setMessages(prev => [...prev, event.message as ChatMessage]);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [sessionId]);
  
  const sendMessage = async (content: string, metadata: Record<string, any> = {}) => {
    if (!sessionId || !content.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
        sessionId,
        metadata
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Use the bridge to send the message
      ChatBridge.sendMessage(sessionId, content, metadata);
      
      // Simulate assistant response for now
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          content: `This is a response to: "${content}"`,
          sender: 'assistant',
          timestamp: new Date(),
          sessionId,
          metadata: {}
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      logger.error('Error sending message', { 
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      setIsLoading(false);
    }
  };
  
  return {
    messages,
    sendMessage,
    isLoading,
    sessionId
  };
}
