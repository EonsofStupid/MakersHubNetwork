
import React from 'react';
import { useChatContext } from '../context/ChatProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ChatSessionProps {
  sessionId: string;
}

export default function ChatSession({ sessionId }: ChatSessionProps) {
  const { messages, sendMessage } = useChatContext();
  const [inputValue, setInputValue] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };
  
  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 h-full flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Chat Session: {sessionId}</h1>
        </div>
        
        <div className="flex-1 overflow-auto bg-card/30 rounded-lg p-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No messages yet. Start typing to begin the conversation.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary/10 ml-auto max-w-[80%]' 
                      : 'bg-card mr-auto max-w-[80%]'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 bg-background border border-input rounded-md"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Send
          </button>
        </form>
      </div>
    </ErrorBoundary>
  );
}
