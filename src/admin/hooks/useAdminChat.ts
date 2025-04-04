
import { useState, useCallback } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { formatLogDetails } from '@/logging/utils/details-formatter';

// Types
export interface AdminChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'admin' | 'system';
  timestamp: Date;
}

/**
 * Hook for admin chat functionality
 */
export function useAdminChat() {
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const logger = useLogger('useAdminChat', { category: LogCategory.ADMIN });
  
  // Initialize chat
  const initializeChat = useCallback(async () => {
    try {
      setIsLoading(true);
      logger.info('Initializing admin chat');
      
      // Simulated API call - replace with actual backend call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set initial welcome message
      setMessages([
        {
          id: 'system-welcome',
          content: 'Welcome to the admin chat. How can I help you today?',
          sender: 'system',
          timestamp: new Date()
        }
      ]);
      
      logger.info('Admin chat initialized successfully');
    } catch (error) {
      logger.error('Error initializing admin chat', {
        details: formatLogDetails(error)
      });
    } finally {
      setIsLoading(false);
    }
  }, [logger]);
  
  // Send a message
  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    
    const newMessage: AdminChatMessage = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    logger.debug('User message sent', { details: { messageId: newMessage.id } });
    
    // Here you would typically send the message to a backend
  }, [logger]);
  
  return {
    messages,
    isLoading,
    initializeChat,
    sendMessage
  };
}
