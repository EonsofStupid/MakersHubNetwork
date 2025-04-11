
import React from 'react';
import { useChatStore } from '../state/chatStore';
import { Button } from '@/ui/core/button';
import { PanelLeftClose, MessageSquarePlus, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/ui/core/scroll-area';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/ui/core/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { chatTheme } from '../styles/theme';
import { ChatMode } from '../types';
import { Z_LAYERS } from '../utils/zLayers';

interface ChatSidebarProps {
  onToggleSidebar: () => void;
}

// Map of mode icons and labels - fully typed with all ChatMode options
const ModeIcons: Record<ChatMode, { icon: React.ReactNode; label: string }> = {
  'chat': { 
    icon: <div className="h-2 w-2 bg-[var(--chat-action-blue)] rounded-full"></div>, 
    label: 'Chat' 
  },
  'ultra': { 
    icon: <div className="h-2 w-2 bg-[var(--chat-action-gold)] rounded-full"></div>, 
    label: 'Ultra' 
  },
  'developer': { 
    icon: <div className="h-2 w-2 bg-[var(--chat-action-purple)] rounded-full"></div>, 
    label: 'Developer' 
  },
  'image': { 
    icon: <div className="h-2 w-2 bg-[var(--chat-action-green)] rounded-full"></div>, 
    label: 'Image' 
  },
  'debug': { 
    icon: <div className="h-2 w-2 bg-[var(--chat-action-pink)] rounded-full"></div>, 
    label: 'Debug' 
  },
  'planning': { 
    icon: <div className="h-2 w-2 bg-[var(--chat-tertiary-accent)] rounded-full"></div>, 
    label: 'Planning' 
  },
  'training': { 
    icon: <div className="h-2 w-2 bg-[var(--chat-secondary-accent)] rounded-full"></div>, 
    label: 'Training' 
  },
  'learn': { 
    icon: <div className="h-2 w-2 bg-[var(--chat-action-yellow)] rounded-full"></div>, 
    label: 'Learn' 
  }
};

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onToggleSidebar }) => {
  const { conversations = [], activeConversationId, setActiveConversation, createConversation } = useChatStore();

  const handleCreateConversation = () => {
    createConversation();
  };

  return (
    <div 
      className={chatTheme.sidebar}
      style={{ zIndex: Z_LAYERS.sidebar }}
    >
      <div 
        className={chatTheme.sidebarHeader}
        style={{ zIndex: Z_LAYERS.sidebarHeader }}
      >
        <h2 className="text-sm font-medium text-white/90">Conversations</h2>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/70 hover:text-white hover:bg-[var(--chat-sidebar-item-bg)]"
                  onClick={handleCreateConversation}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" style={{ zIndex: Z_LAYERS.tooltip }}>
                <p>New conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/70 hover:text-white hover:bg-[var(--chat-sidebar-item-bg)]"
                  onClick={onToggleSidebar}
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" style={{ zIndex: Z_LAYERS.tooltip }}>
                <p>Hide sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <ScrollArea 
        className="flex-1"
        style={{ zIndex: Z_LAYERS.sidebarContent }}
      >
        <div className="p-2 flex flex-col gap-1.5">
          {Array.isArray(conversations) && conversations.length > 0 ? (
            <AnimatePresence initial={false}>
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    rounded-md cursor-pointer p-2.5 text-sm
                    ${conversation.id === activeConversationId 
                      ? chatTheme.sidebarItemActive
                      : chatTheme.sidebarItemInactive
                    }
                  `}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {conversation.mode && ModeIcons[conversation.mode] ? 
                        ModeIcons[conversation.mode].icon : 
                        <div className="h-2 w-2 bg-[var(--chat-action-blue)] rounded-full"></div>
                      }
                      <span className="truncate">{conversation.title}</span>
                    </div>
                    <span className="text-[10px] opacity-70">
                      {formatDistanceToNow(conversation.updatedAt, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="mt-1.5 text-[10px] opacity-70 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {conversation.mode && ModeIcons[conversation.mode] ? 
                        <span>{ModeIcons[conversation.mode].label}</span> : 
                        <span>Chat</span>
                      }
                      <span>•</span>
                      <span>
                        {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="p-4 text-center text-white/60 text-xs">
              <p className="mb-2">No conversations yet</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCreateConversation}
                className="bg-[var(--chat-sidebar-item-bg)] hover:bg-[var(--chat-sidebar-item-hover)] border-[var(--chat-sidebar-border)] text-white/80 hover:text-white w-full"
              >
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Start a conversation
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div 
        className="p-2 border-t border-[var(--chat-sidebar-border)] mt-auto"
        style={{ zIndex: Z_LAYERS.sidebarFooter }}
      >
        <div className="text-xs text-white/60 px-2 py-1">
          MakersImpulse AI
        </div>
      </div>
    </div>
  );
};
