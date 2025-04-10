
import React from 'react';
import { useChat } from '../context/ChatProvider';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

export function ChatWidget() {
  const { isOpen, toggleChat, messages, sendMessage } = useChat();
  const [inputValue, setInputValue] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };
  
  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        variant="default"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }
  
  return (
    <div className="bg-background border border-border rounded-lg shadow-xl w-[350px] max-h-[500px] flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Chat Support</h3>
        <Button
          onClick={toggleChat}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              Start a conversation...
            </p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 block mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t flex">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-background border rounded-l-md focus-visible:outline-none focus-visible:ring-1"
        />
        <Button type="submit" className="rounded-l-none">
          Send
        </Button>
      </form>
    </div>
  );
}

export default ChatWidget;
