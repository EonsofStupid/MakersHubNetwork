
import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useChatSession } from '../hooks/useChatSession';
import { Button } from '@/shared/ui';
import { ChatWrapper } from './ChatWrapper';

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatSession = useChatSession();
  
  // If chat is not enabled, don't render anything
  if (!chatSession.isChatEnabled) {
    return null;
  }
  
  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button 
          onClick={toggleChat}
          className="h-12 w-12 rounded-full shadow-lg"
          variant="default"
          size="icon"
        >
          <MessageCircle size={24} />
        </Button>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-80 sm:w-96 h-[500px] flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-medium">Chat Assistant</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleChat}
              className="h-8 w-8 p-0"
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ChatWrapper />
          </div>
        </div>
      )}
    </div>
  );
};
