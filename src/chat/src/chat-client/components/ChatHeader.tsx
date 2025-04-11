
import React from 'react';
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
  ChevronDown,
  Plus,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { useChatStore } from '../state/chatStore';

interface ModeOption {
  mode: ChatMode;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface ChatHeaderProps {
  activeMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onNewConversation: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  activeMode, 
  onModeChange,
  onNewConversation
}) => {
  const [isModeMenuOpen, setIsModeMenuOpen] = React.useState<boolean>(false);
  
  const modes: ModeOption[] = [
    { mode: 'chat', label: 'Chat', icon: <MessageCircle className="w-4 h-4" />, description: 'General conversation (Claude)' },
    { mode: 'ultra', label: 'Ultra', icon: <Zap className="w-4 h-4" />, description: 'Premium GPT-4 chat' },
    { mode: 'developer', label: 'Dev', icon: <Code className="w-4 h-4" />, description: 'Coding assistance (GPT)' },
    { mode: 'image', label: 'Image', icon: <Image className="w-4 h-4" />, description: 'Image generation' },
    { mode: 'debug', label: 'Debug', icon: <BugPlay className="w-4 h-4" />, description: 'Help with troubleshooting (GPT)' },
    { mode: 'planning', label: 'Planning', icon: <Kanban className="w-4 h-4" />, description: 'Project planning' },
    { mode: 'training', label: 'Learn', icon: <GraduationCap className="w-4 h-4" />, description: 'Learning resources (Claude)' }
  ];

  // Animations for the mode menu
  const menuContainerVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const menuItemVariants = {
    hidden: { y: -5, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  const activeItem = modes.find(m => m.mode === activeMode);

  return (
    <div className={chatTheme.header}>
      <div className="flex items-center">
        <h2 className={chatTheme.headerTitle}>AI Assistant</h2>
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onNewConversation}
                className="bg-[var(--chat-secondary-accent)] text-white hover:bg-[var(--chat-secondary-accent)]/90 rounded-full h-8 w-8 p-0"
                size="icon"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">New conversation</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      
        <div className="relative" style={{ zIndex: Z_LAYERS.modeSelector }}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                  className={chatTheme.modeButton}
                  variant="ghost"
                  size="sm"
                >
                  <div className="flex items-center gap-1.5">
                    {activeItem?.icon}
                    <span className="text-xs font-medium">{activeItem?.label}</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Change chat mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AnimatePresence>
            {isModeMenuOpen && (
              <motion.div 
                className={chatTheme.modeMenu}
                style={{ zIndex: Z_LAYERS.modePopup }}
                variants={menuContainerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="grid grid-cols-3 gap-1.5 p-2">
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
                      <div className="flex flex-col items-center justify-center p-2">
                        {mode.icon}
                        <span className="mt-1 text-[10px] font-medium">{mode.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
