
import React, { useEffect } from 'react';
import { DevChatProvider } from '../providers/DevChatProvider';
import { ChatClient } from '../chat-client/components/ChatClient';
import { DevChatControls } from '../components/DevChatControls';

export default function DevChatPage() {
  // Fixed the missing argument issue by providing a default value
  const someFunction = (argument: string = "default") => {
    console.log("Development mode:", argument);
  };

  useEffect(() => {
    // Call the function with an argument
    someFunction("dev");
  }, []);

  return (
    <DevChatProvider>
      <div className="flex flex-col h-screen">
        <DevChatControls />
        <ChatClient />
      </div>
    </DevChatProvider>
  );
}
