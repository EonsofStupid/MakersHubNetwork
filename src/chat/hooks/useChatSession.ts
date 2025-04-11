
import { useState, useEffect } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { chatBridge } from '../lib/ChatBridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { v4 as uuidv4 } from 'uuid';
import { CircuitBreaker } from '@/utils/CircuitBreaker';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  sessionId?: string;
}

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
    // Fix: Pass numeric value instead of string for count method
    if (chatBreaker.count(1) > 3) {
      logger.warn('Breaking potential infinite loop in useChatSession initialization');
      return;
    }
    
    if (externalSessionId) {
      setSessionId(externalSessionId);
    } else if (!sessionId) {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      
      chatBridge.publish('system', {
        type: 'session-created',
        sessionId: newSessionId,
        mode,
        userId: user?.id
      });
      
      logger.info('Created new chat session', {
        details: { sessionId: newSessionId, mode }
      });
    }
  }, [externalSessionId, sessionId, user?.id, logger, mode]);
  
  useEffect(() => {
    if (!sessionId) return;
    
    const sessionChannel = `session:${sessionId}`;
    
    const unsubscribe = chatBridge.subscribe(sessionChannel, (message) => {
      if (message.type === 'new-message') {
        setMessages(prev => [...prev, message.message]);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [sessionId]);
  
  const sendMessage = async (content: string) => {
    if (!sessionId || !content.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
        sessionId
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      chatBridge.publish('message', {
        type: 'send-message',
        message: userMessage,
        sessionId
      });
      
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          content: `This is a response to: "${content}"`,
          sender: 'assistant',
          timestamp: new Date(),
          sessionId
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
