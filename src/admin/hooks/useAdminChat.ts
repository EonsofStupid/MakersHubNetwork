
import { useState, useEffect, useCallback } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

// Simple interface for chat messages
interface ChatMessage {
  id: string;
  text: string;
  sender: 'admin' | 'user' | 'system';
  timestamp: Date;
}

export function useAdminChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const logger = useLogger('AdminChat', LogCategory.ADMIN);
  
  const sendMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      sender: 'admin',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    logger.info('Admin sent message', { details: { messageId: newMessage.id }});
    
    // Simulate a response
    setTimeout(() => {
      const response: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        text: `Response to: ${text}`,
        sender: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
    
    return newMessage.id;
  }, [logger]);
  
  return {
    messages,
    sendMessage,
    isConnecting
  };
}

export function useAdminChatListener(callback: (message: any) => void) {
  const logger = useLogger('AdminChatListener', LogCategory.ADMIN);
  
  useEffect(() => {
    logger.info('Admin chat listener initialized');
    
    // Cleanup function
    return () => {
      logger.info('Admin chat listener removed');
    };
  }, [logger]);
  
  return {
    isActive: true
  };
}
