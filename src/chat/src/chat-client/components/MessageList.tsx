
import React from 'react';
import { ChatMessage } from '../context/ChatContext';

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-3 rounded-lg ${
            message.role === 'user'
              ? 'bg-primary/10 ml-auto max-w-[80%]'
              : message.role === 'assistant'
              ? 'bg-secondary/10 mr-auto max-w-[80%]'
              : 'bg-muted/50 mx-auto max-w-[90%] italic'
          }`}
        >
          <div className="flex items-center mb-1">
            <span className="font-bold">
              {message.role === 'user'
                ? 'You'
                : message.role === 'assistant'
                ? 'Assistant'
                : 'System'}
            </span>
            <span className="ml-2 text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
};
