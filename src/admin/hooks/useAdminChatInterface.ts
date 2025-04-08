
import { useState, useEffect, useCallback } from 'react';
import { adminChatBridge } from '../utils/chatBridge';
import { chatBridge } from '@/chat/lib/ChatBridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for admin interface to manage chat functionality
 */
export function useAdminChatInterface() {
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const logger = useLogger('AdminChatInterface', LogCategory.ADMIN);
  
  // Set up initial listeners for chat events
  useEffect(() => {
    logger.info('Setting up admin chat interface');
    
    // Listen for new chat sessions
    const unsubscribeSystem = chatBridge.subscribe('system', (message) => {
      if (message.type === 'session-created') {
        logger.info('New chat session detected', { 
          details: { sessionId: message.sessionId }
        });
        
        setActiveSessions(prev => [
          ...prev, 
          {
            id: message.sessionId,
            createdAt: new Date(),
            userId: message.userId,
            mode: message.mode || 'normal',
            messages: []
          }
        ]);
      }
    });
    
    // Listen for chat messages
    const unsubscribeMessage = chatBridge.subscribe('message', (message) => {
      if (message.type === 'send-message') {
        logger.info('New chat message received', {
          details: { sessionId: message.sessionId }
        });
        
        // Update the session with the new message
        setActiveSessions(prev => prev.map(session => {
          if (session.id === message.sessionId) {
            return {
              ...session,
              messages: [...session.messages, message.message]
            };
          }
          return session;
        }));
      }
    });
    
    // Clean up
    return () => {
      unsubscribeSystem();
      unsubscribeMessage();
    };
  }, [logger]);
  
  // Send admin message to a specific session
  const sendAdminMessage = useCallback((sessionId: string, content: string) => {
    if (!sessionId || !content.trim()) return;
    
    const adminMessage = {
      id: `admin-${Date.now()}`,
      content,
      sender: 'assistant',
      timestamp: new Date(),
      sessionId,
      isAdminMessage: true
    };
    
    // Publish to specific session channel
    chatBridge.publish(`session:${sessionId}`, {
      type: 'new-message',
      message: adminMessage
    });
    
    // Update local state
    setActiveSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, adminMessage]
        };
      }
      return session;
    }));
    
    logger.info('Admin message sent', {
      details: { sessionId }
    });
  }, [logger]);
  
  return {
    activeSessions,
    isLoading,
    sendAdminMessage
  };
}
