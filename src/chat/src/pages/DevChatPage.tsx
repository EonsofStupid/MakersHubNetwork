
import React from 'react';
import { useParams } from '@tanstack/react-router';
import { Chat } from '../chat-client/components/Chat';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export default function DevChatPage() {
  const { sessionId } = useParams() as { sessionId?: string };
  const logger = useLogger('DevChatPage', LogCategory.SYSTEM);
  
  React.useEffect(() => {
    logger.info('Dev chat page initialized', { 
      details: { sessionId: sessionId || 'new-session' } 
    });
  }, [logger, sessionId]);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Developer Chat</h1>
      <p className="text-gray-600 mb-6">
        This is a developer chat interface for testing and debugging the chat functionality.
      </p>
      
      <div className="border rounded-lg p-4 bg-card">
        <Chat sessionId={sessionId} />
      </div>
    </div>
  );
}
