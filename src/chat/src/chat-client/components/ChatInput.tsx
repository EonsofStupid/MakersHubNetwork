
import React, { useState } from 'react';

export interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting || isLoading) return;

    setIsSubmitting(true);
    try {
      await onSendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        disabled={isSubmitting || isLoading}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary/90 disabled:opacity-50"
        disabled={!message.trim() || isSubmitting || isLoading}
      >
        {isSubmitting || isLoading ? (
          <span className="flex items-center">
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            Sending...
          </span>
        ) : (
          'Send'
        )}
      </button>
    </form>
  );
};
