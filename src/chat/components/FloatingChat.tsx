import React, { useState } from 'react';
import { PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useChatPersistence } from '@/chat/hooks/useChatPersistence';
import { cn } from '@/lib/utils';
import { authBridge } from '@/bridges/AuthBridge';
import { ChatWrapper } from './ChatWrapper';

interface FloatingChatProps {
  className?: string;
}

export function FloatingChat({ className }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isChatEnabled } = useChatPersistence();
  
  // Check if user is authenticated
  const isAuthenticated = authBridge.isAuthenticated();
  
  // Don't render if chat is disabled or user is not authenticated
  if (!isChatEnabled || !isAuthenticated) {
    return null;
  }
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        className="overflow-hidden rounded-lg shadow-lg"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <ChatWrapper />
      </motion.div>
      
      <Button
        variant="secondary"
        onClick={toggleChat}
        className={cn(
          "w-40 flex items-center justify-center gap-2",
          className
        )}
      >
        <PanelRight className="h-4 w-4" />
        {isOpen ? 'Close Chat' : 'Open Chat'}
      </Button>
    </div>
  );
}
