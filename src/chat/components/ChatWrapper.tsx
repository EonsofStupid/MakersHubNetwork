
import React, { ReactNode } from 'react';
import { useChatSession } from '../hooks/useChatSession';

export interface ChatWrapperProps {
  children?: ReactNode;
}

export const ChatWrapper: React.FC<ChatWrapperProps> = ({ children }) => {
  const { getCurrentSession, sessions, currentSessionId } = useChatSession();
  const currentSession = getCurrentSession();
  
  return (
    <div className="flex flex-col h-full">
      {children || (
        <div className="flex-1 overflow-y-auto p-3">
          {currentSession ? (
            <div className="space-y-4">
              {currentSession.messages?.map((message, index) => (
                <div 
                  key={message.id || index}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No active chat session
            </div>
          )}
        </div>
      )}
      
      <div className="p-3 border-t">
        <form className="flex gap-2" onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
          if (input?.value) {
            // Use saveMessage for now since we don't have sendMessage directly
            const chatSession = useChatSession();
            chatSession.saveMessage({
              content: input.value,
              sender: 'user',
              timestamp: Date.now()
            });
            input.value = '';
          }
        }}>
          <input 
            type="text" 
            name="message"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="Type your message..."
          />
          <button 
            type="submit"
            className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
