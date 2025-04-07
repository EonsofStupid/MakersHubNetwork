
import React from 'react';
import { useChat } from '../context/ChatContext';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ContextLoader } from './ContextLoader';

interface ChatClientProps {
  // You can add additional props here if needed
}

export const ChatClient: React.FC<ChatClientProps> = () => {
  const chatContext = useChat();
  // For now, we'll just use a default mode
  const mode = 'normal';
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-white">Chat</h2>
        <ContextLoader />
      </div>
      
      <div className="flex-1 overflow-auto">
        <MessageList messages={chatContext.messages} />
      </div>
      
      <div className="mt-4">
        <ChatInput 
          onSendMessage={chatContext.sendMessage}
          isLoading={chatContext.isLoading}
        />
      </div>
    </div>
  );
};
