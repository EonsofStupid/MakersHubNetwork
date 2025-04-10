
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { chatBridge } from '../lib/ChatBridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { CircuitBreaker } from '@/utils/CircuitBreaker';

interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  messages: any[];
  sendMessage: (content: string) => void;
  activeSessionId: string | null;
}

const defaultContext: ChatContextType = {
  isOpen: false,
  openChat: () => {},
  closeChat: () => {},
  toggleChat: () => {},
  messages: [],
  sendMessage: () => {},
  activeSessionId: null,
};

const ChatContext = createContext<ChatContextType>(defaultContext);

export const useChat = () => useContext(ChatContext);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const logger = useLogger('ChatProvider', LogCategory.CHAT);
  
  // Create circuit breaker
  const breakerRef = useRef(new CircuitBreaker('chat-provider', 5, 1000));
  
  // Initialize the chat session when the component mounts
  useEffect(() => {
    // Use the circuit breaker to prevent infinite initialization loops
    const count = breakerRef.current.count('init');
    if (count > 3) {
      logger.warn('Circuit breaker triggered in ChatProvider - aborting initialization');
      return;
    }
    
    // Create a new chat session
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setActiveSessionId(sessionId);
    
    logger.info('Created new chat session', {
      details: { sessionId }
    });
    
    // Subscribe to messages for this session
    const unsubscribe = chatBridge.subscribe(`session:${sessionId}`, (message) => {
      if (message.type === 'new-message') {
        setMessages(prev => [...prev, message.message]);
      }
    });
    
    return () => {
      unsubscribe();
      breakerRef.current.reset();
    };
  }, [logger]);
  
  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen(prev => !prev);
  
  const sendMessage = (content: string) => {
    if (!activeSessionId) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    chatBridge.publish('message', {
      type: 'send-message',
      message: userMessage,
      sessionId: activeSessionId
    });
  };
  
  return (
    <ChatContext.Provider value={{
      isOpen,
      openChat,
      closeChat,
      toggleChat,
      messages,
      sendMessage,
      activeSessionId
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
