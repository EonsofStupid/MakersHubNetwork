
import React, { createContext, useContext, useState } from 'react';

interface ChatContextType {
  messages: any[];
  sendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  sendMessage: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<any[]>([]);
  
  const sendMessage = (content: string) => {
    setMessages(prev => [...prev, { content, sender: 'user', id: Date.now() }]);
  };
  
  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}
