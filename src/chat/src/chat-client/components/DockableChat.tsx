
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatClient } from './ChatClient';
import { X, Minimize2, Maximize2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { chatTheme } from '../styles/theme';
import { Z_LAYERS } from '../utils/zLayers';
import '../styles/variables.css';

type DockPosition = 'bottom-left' | 'bottom-right';

interface DockableChatProps {
  position?: DockPosition;
  initialOpen?: boolean;
}

export const DockableChat: React.FC<DockableChatProps> = ({
  position = 'bottom-right',
  initialOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const toggleOpen = (): void => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const toggleMinimize = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const positionClasses = {
    'bottom-left': 'left-4',
    'bottom-right': 'right-4',
  };

  return (
    <motion.div
      className={cn(
        'fixed bottom-4 z-50',
        positionClasses[position]
      )}
      style={{ zIndex: Z_LAYERS.floatingButton }}
      animate={{
        height: isMinimized ? 'auto' : isOpen ? 'auto' : 'auto',
        width: isMinimized ? 'auto' : isOpen ? (isMobile ? '95vw' : '80vw') : 'auto',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="chat-button"
            className={cn(chatTheme.chatTrigger, "chat-shadow")}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleOpen}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        ) : (
          <motion.div
            key="chat-window"
            className="chat-glass depth-effect chat-font chat-rounded cyber-border overflow-hidden"
            style={{ 
              height: isMinimized ? 'auto' : '80vh', 
              width: '100%', 
              maxWidth: isMobile ? '95vw' : '80vw',
              zIndex: Z_LAYERS.base
            }}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300 
            }}
          >
            <div 
              className={cn(chatTheme.header, "border-b border-[var(--chat-border-color)]")} 
              style={{ zIndex: Z_LAYERS.header }}
            >
              <h3 className={cn(chatTheme.headerTitle, "cyber-text-glow")}>MakersImpulse AI</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMinimize} 
                  className={cn(chatTheme.iconButton, "hover:bg-[var(--chat-mode-selector-hover-bg)]")}
                  aria-label={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={toggleOpen} 
                  className={cn(chatTheme.iconButton, "hover:bg-[var(--chat-mode-selector-hover-bg)]")}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {!isMinimized && (
              <motion.div 
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <ChatClient />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
