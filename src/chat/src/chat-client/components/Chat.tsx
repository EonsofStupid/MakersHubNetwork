
import React from 'react';

interface ChatProps {
  sessionId?: string;
  initialMessages?: any[];
  onMessageSent?: (message: string) => void;
}

export function Chat({ sessionId, initialMessages = [], onMessageSent }: ChatProps) {
  return (
    <div className="chat-container">
      <div className="chat-messages">
        {/* Placeholder for chat messages */}
        <div className="flex justify-center items-center h-40">
          <p>Chat component placeholder</p>
        </div>
      </div>
    </div>
  );
}
