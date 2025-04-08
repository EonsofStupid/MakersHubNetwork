
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { chatBridge } from '../lib/ChatBridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAuthState } from '@/auth/hooks/useAuthState';
import CircuitBreaker from '@/utils/CircuitBreaker';

// Define the shape of our chat context
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

// Create the context with a default value
const ChatContext = createContext<ChatContextValue | null>(null);

// Provider component
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const logger = useLogger('ChatProvider', LogCategory.CHAT);
  const { user, isAuthenticated } = useAuthState();
  const initRef = useRef(false);
  
  // Initialize circuit breaker
  useEffect(() => {
    CircuitBreaker.init('ChatProvider', 5, 1000);
    
    // Clean up on component unmount
    return () => {
      logger.info('Chat provider unmounting');
    };
  }, [logger]);
  
  // Set up chat bridge listener - only once
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    logger.info('Initializing chat bridge listener');
    
    const unsubscribe = chatBridge.subscribe('system', (message) => {
      logger.info('Received system message', {
        details: { type: message.type }
      });
      
      // Handle system messages
      switch (message.type) {
        case 'session-created':
          setActiveSessionId(message.sessionId);
          break;
        case 'message-received':
          setMessages(prev => [...prev, message.message]);
          break;
      }
    });
    
    // Clean up subscription
    return () => {
      unsubscribe();
    };
  }, [logger]);
  
  // Toggle chat visibility
  const toggleChat = () => {
    if (CircuitBreaker.isTripped('ChatProvider')) {
      logger.warn('Circuit breaker tripped, ignoring toggle action');
      return;
    }
    
    setIsOpen(prev => !prev);
  };
  
  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  
  // Send message through chat bridge
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Create a new message object
      const message = {
        id: `msg-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
        sessionId: activeSessionId,
        userId: user?.id
      };
      
      // Add to local messages
      setMessages(prev => [...prev, message]);
      
      // Send through bridge
      chatBridge.publish('message', {
        type: 'user-message',
        message
      });
      
      // Simulate response for now
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

// Custom hook to use the chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === null) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
