
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { chatBridge } from '../lib/ChatBridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { CircuitBreaker } from '@/utils/circuitBreaker';
import { useAuthState } from '@/auth/hooks/useAuthState';

interface ChatContextValue {
  isOpen: boolean;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  messages: any[];
  sendMessage: (content: string) => Promise<void>;
  activeSessionId: string | null;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const logger = useLogger('ChatProvider', LogCategory.CHAT);
  const { user } = useAuthState();
  const initRef = useRef(false);
  const chatBreaker = useRef(new CircuitBreaker('ChatProvider', 5, 1000));
  
  useEffect(() => {
    // Create instance instead of using static method
    chatBreaker.current = new CircuitBreaker('ChatProvider', 5, 1000);
    
    return () => {
      logger.info('Chat provider unmounting');
    };
  }, [logger]);
  
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    logger.info('Initializing chat bridge listener');
    
    const unsubscribe = chatBridge.subscribe('system', (message) => {
      logger.info('Received system message', {
        details: { type: message.type }
      });
      
      switch (message.type) {
        case 'session-created':
          setActiveSessionId(message.sessionId);
          break;
        case 'message-received':
          setMessages(prev => [...prev, message.message]);
          break;
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  const toggleChat = () => {
    if (chatBreaker.current.isOpen) {
      logger.warn('Circuit breaker tripped, ignoring toggle action');
      return;
    }
    
    setIsOpen(prev => !prev);
  };
  
  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      setIsLoading(true);
      
      const message = {
        id: `msg-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
        sessionId: activeSessionId,
        userId: user?.id
      };
      
      setMessages(prev => [...prev, message]);
      
      setTimeout(() => {
        chatBridge.publish('message', {
          type: 'user-message',
          message
        });
      }, 0);
      
      setTimeout(() => {
        const responseMessage = {
          id: `msg-${Date.now()}`,
          content: `Echo: ${content}`,
          sender: 'assistant',
          timestamp: new Date(),
          sessionId: activeSessionId
        };
        
        setMessages(prev => [...prev, responseMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      logger.error('Error sending message', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      setIsLoading(false);
    }
  };
  
  const value = {
    isOpen,
    toggleChat,
    openChat,
    closeChat,
    messages,
    sendMessage,
    activeSessionId,
    isLoading
  };
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === null) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
