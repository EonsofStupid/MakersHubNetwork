
import { useState, useCallback, useEffect } from 'react';
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

/**
 * Hook for listening to admin chat events
 */
export function useAdminChatListener(
  onNewMessage?: (message: AdminChatMessage) => void,
  onStatusChange?: (isOnline: boolean) => void
) {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const logger = useLogger('useAdminChatListener', { category: LogCategory.ADMIN });

  // Set up chat listeners
  useEffect(() => {
    logger.debug('Setting up admin chat listeners');
    
    // Simulate connection established after a delay
    const connectionTimer = setTimeout(() => {
      setIsOnline(true);
      onStatusChange?.(true);
      logger.info('Admin chat connection established');
    }, 1500);
    
    // Simulate receiving messages periodically
    const messageTimer = setInterval(() => {
      if (Math.random() > 0.8 && isOnline) {
        const systemMessage: AdminChatMessage = {
          id: `system-${Date.now()}`,
          content: 'Is there anything else you need help with?',
          sender: 'system',
          timestamp: new Date()
        };
        
        onNewMessage?.(systemMessage);
        logger.debug('Received system message', { details: { messageId: systemMessage.id } });
      }
    }, 30000); // Check every 30 seconds with low probability
    
    return () => {
      clearTimeout(connectionTimer);
      clearInterval(messageTimer);
      logger.debug('Cleaned up admin chat listeners');
    };
  }, [isOnline, onNewMessage, onStatusChange, logger]);
  
  return {
    isOnline
  };
}
