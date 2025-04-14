
import React, { useState } from 'react';
import { useChatSession } from '../hooks/useChatSession';
import { Send } from 'lucide-react';
import { Button } from '@/shared/ui';

export const ChatWrapper: React.FC = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useChatSession();

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-slate-800">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
            Start a conversation
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white ml-auto rounded-br-none'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-3 border-t dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-md resize-none h-10 max-h-24 focus:outline-none focus:ring-1 dark:bg-slate-800 dark:border-slate-700"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="h-10 w-10 p-2"
            variant="default"
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
