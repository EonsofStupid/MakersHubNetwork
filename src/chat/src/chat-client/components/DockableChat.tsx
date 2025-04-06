
import React from 'react';
import { useMobile } from '@/hooks/use-mobile';
import { Chat } from './Chat';

interface DockableChatProps {
  isDocked?: boolean;
  onToggleDock?: () => void;
  sessionId?: string;
}

export function DockableChat({ isDocked = true, onToggleDock, sessionId }: DockableChatProps) {
  const isMobile = useMobile();
  
  return (
    <div className={`dockable-chat ${isDocked ? 'docked' : 'floating'} ${isMobile ? 'mobile' : ''}`}>
      <div className="chat-header">
        <h3>Chat</h3>
        {onToggleDock && (
          <button onClick={onToggleDock}>
            {isDocked ? 'Undock' : 'Dock'}
          </button>
        )}
      </div>
      <Chat sessionId={sessionId} />
    </div>
  );
}
