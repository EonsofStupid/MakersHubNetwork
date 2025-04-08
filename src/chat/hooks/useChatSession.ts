
import { useState, useEffect } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { chatBridge } from '../lib/ChatBridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { v4 as uuidv4 } from 'uuid';

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
  
  // Create or use session ID
  useEffect(() => {
    if (externalSessionId) {
      setSessionId(externalSessionId);
    } else if (!sessionId) {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      
      // Notify about new session
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
  
  // Set up listener for this specific session
  useEffect(() => {
    if (!sessionId) return;
    
    // Create a session-specific channel
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
  
  // Send message function
  const sendMessage = async (content: string) => {
    if (!sessionId || !content.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Create user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
        sessionId
      };
      
      // Add locally
      setMessages(prev => [...prev, userMessage]);
      
      // Send through bridge
      chatBridge.publish('message', {
        type: 'send-message',
        message: userMessage,
        sessionId
      });
      
      // Simulate response for now
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
