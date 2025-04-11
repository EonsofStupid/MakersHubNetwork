
import React, { useState } from 'react';
import { ChatMode } from '../types';
import { chatTheme } from '../styles/theme';
import { Z_LAYERS } from '../utils/zLayers';
import { 
  MessageCircle, 
  Code, 
  Image, 
  BugPlay,
  Kanban,
  GraduationCap,
  Settings,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatTabsProps {
  activeMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export const ChatTabs: React.FC<ChatTabsProps> = ({ activeMode, onModeChange }) => {
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  
  const modes: { mode: ChatMode; label: string; icon: React.ReactNode; description: string }[] = [
    { mode: 'chat', label: 'Chat', icon: <MessageCircle className="w-5 h-5" />, description: 'General conversation (Claude)' },
    { mode: 'ultra', label: 'Ultra', icon: <Zap className="w-5 h-5" />, description: 'Premium GPT-4 chat' },
    { mode: 'developer', label: 'Dev', icon: <Code className="w-5 h-5" />, description: 'Coding assistance (GPT)' },
    { mode: 'image', label: 'Image', icon: <Image className="w-5 h-5" />, description: 'Image generation' },
    { mode: 'debug', label: 'Debug', icon: <BugPlay className="w-5 h-5" />, description: 'Help with troubleshooting (GPT)' },
    { mode: 'planning', label: 'Planning', icon: <Kanban className="w-5 h-5" />, description: 'Project planning' },
    { mode: 'training', label: 'Learn', icon: <GraduationCap className="w-5 h-5" />, description: 'Learning resources (Claude)' }
  ];

  // Animations for the mode button
  const modeButtonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, rotate: 0 },
    tap: { scale: 0.95 }
  };

  // Animations for the mode menu
  const menuContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  };
  
  const menuItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <div className="relative" style={{ zIndex: Z_LAYERS.modeSelector }}>
      <div className={chatTheme.modeSelector}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button 
                className={chatTheme.modeButton}
                onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                variants={modeButtonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                animate={isModeMenuOpen ? "active" : "rest"}
              >
                <div className="flex items-center gap-2">
                  {modes.find(m => m.mode === activeMode)?.icon}
                  <span className="font-medium">{modes.find(m => m.mode === activeMode)?.label}</span>
                </div>
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isModeMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-2"
                >
                  <Settings className="w-4 h-4" />
                </motion.div>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change chat mode</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <AnimatePresence>
        {isModeMenuOpen && (
          <motion.div 
            className={chatTheme.modeMenu}
            style={{ 
              zIndex: Z_LAYERS.modePopup,
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              width: 'auto',
              backgroundColor: 'var(--chat-bg)',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '1px solid var(--chat-border)'
            }}
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="grid grid-cols-3 gap-2 p-3">
              {modes.map((mode) => (
                <motion.button
                  key={mode.mode}
                  variants={menuItemVariants}
                  className={`${chatTheme.modeMenuItem} ${activeMode === mode.mode ? chatTheme.activeMenuItem : ''}`}
                  onClick={() => {
                    onModeChange(mode.mode);
                    setIsModeMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center justify-center p-3">
                    {mode.icon}
                    <span className="mt-1 text-xs font-medium">{mode.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
