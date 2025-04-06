
import React, { useRef, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { useChatSession } from '../hooks/useChatSession';
import { useChatStore } from '../state/chatStore';
import { chatTheme } from '../styles/theme';
import { Z_LAYERS } from '../utils/zLayers';
import { Loader2, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatSidebar } from './ChatSidebar';
import { Button } from '@/components/ui/button';
import '../styles/variables.css';

// Component-level Jotai atoms
const scrollPositionAtom = atom<number>(0);
const isSidebarOpenAtom = atom<boolean>(true);

export const ChatClient: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    sendMessage,
    mode 
  } = useChatSession();
  
  const setMode = useChatStore((state) => state.setMode);
  const createConversation = useChatStore((state) => state.createConversation);
  const conversations = useChatStore((state) => state.conversations || []);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  useEffect(() => {
    // Create initial conversation if none exists
    if (!Array.isArray(conversations) || conversations.length === 0) {
      createConversation();
    }
  }, [conversations, createConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle scroll position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollTop);
  };

  // Loading dots animation
  const TypingIndicator = () => (
    <div className="flex space-x-1.5 items-center px-2 py-1">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 rounded-full bg-[var(--chat-primary-accent)]"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop",
            delay: dot * 0.15,
          }}
        />
      ))}
    </div>
  );

  const handleNewConversation = () => {
    createConversation(mode);
  };

  return (
    <div className="flex h-full">
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="h-full overflow-hidden"
            style={{ zIndex: Z_LAYERS.sidebar }}
          >
            <ChatSidebar 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className={`${chatTheme.container} flex-1 h-full`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ zIndex: Z_LAYERS.base }}
      >
        <div className={chatTheme.header}>
          {!isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 mr-2 text-white/70 hover:text-white hover:bg-[var(--chat-mode-selector-hover-bg)]"
              onClick={() => setIsSidebarOpen(true)}
              style={{ zIndex: Z_LAYERS.sidebarToggle }}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}
          
          <ChatHeader 
            activeMode={mode} 
            onModeChange={setMode}
            onNewConversation={handleNewConversation}
          />
        </div>
        
        <div 
          className={chatTheme.messageList} 
          onScroll={handleScroll}
          style={{ zIndex: Z_LAYERS.messages }}
        >
          <AnimatePresence initial={false}>
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                className="h-full flex items-center justify-center text-[var(--chat-text-secondary)] text-center p-4"
              >
                <div>
                  <p className="mb-2">Start a conversation with MakersImpulse AI</p>
                  <p className="text-sm opacity-70">Using {mode} mode</p>
                </div>
              </motion.div>
            )}
            
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={`${chatTheme.aiBubble} flex items-center py-3 px-4`}>
                <TypingIndicator />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <ChatInput
          onSendMessage={sendMessage}
          disabled={isLoading}
          placeholder={`Message in ${mode} mode...`}
        />
      </motion.div>
    </div>
  );
};
