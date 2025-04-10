
import React from 'react';
import { ChatProvider } from '../chat-client/context/ChatContext';
import { ChatClient } from '../chat-client/components/ChatClient';

interface DevChatPageProps {
  mode?: 'normal' | 'dev' | 'debug';
}

const DevChatPage: React.FC<DevChatPageProps> = ({ mode = 'normal' }) => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-black">
        <div className="mx-auto max-w-4xl p-4">
          <ChatClient />
        </div>
      </div>
    </ChatProvider>
  );
};

export default DevChatPage;
