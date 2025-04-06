
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { chatTheme } from '../styles/theme';
import { Z_LAYERS } from '../utils/zLayers';
import { Button } from '@/components/ui/button';
import { SendIcon, PlusCircle, Sparkles } from 'lucide-react';
import { atom, useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { useChatStore } from '../state/chatStore';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChatMode } from '../types';

// Component-level state using Jotai
const inputValueAtom = atom<string>('');

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Message..."
}) => {
  const [inputValue, setInputValue] = useAtom(inputValueAtom);
  const [isComposing, setIsComposing] = useState<boolean>(false); // For IME composition
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mode = useChatStore((state) => state.mode);
  
  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Set the height to scrollHeight + small buffer
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 24), 200);
    textarea.style.height = `${newHeight}px`;
  }, [inputValue]);

  const handleSubmit = (): void => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // ChatGPT-like keyboard handling
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    // Don't handle events during IME composition
    if (isComposing) return;
    
    // Enter without shift to send, but with shift for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    
    // Cmd/Ctrl + Enter always submits
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Get mode-specific placeholder
  const getModePlaceholder = (): string => {
    switch (mode as ChatMode) {
      case 'chat': return "Message MakersImpulse AI...";
      case 'ultra': return "Premium GPT-4 MakersImpulse AI...";
      case 'developer': return "Ask coding or development questions...";
      case 'image': return "Describe an image to generate...";
      case 'debug': return "Describe the issue you're facing...";
      case 'planning': return "What would you like to plan?";
      case 'training': return "What would you like to learn?";
      default: return placeholder;
    }
  };

  return (
    <motion.div 
      className={chatTheme.inputContainer}
      style={{ zIndex: Z_LAYERS.input }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className={chatTheme.inputWrapper}>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-[var(--chat-secondary-accent)]"
                    disabled={disabled}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Add attachment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-[var(--chat-primary-accent)]"
                    disabled={disabled}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>AI suggestions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          className="flex-grow bg-transparent border-none text-[var(--chat-input-text)] placeholder:text-[var(--chat-input-placeholder)] focus:outline-none focus:ring-0 min-h-[24px] max-h-[200px] py-2 px-0 resize-none"
          placeholder={getModePlaceholder()}
          disabled={disabled}
          rows={1}
        />
        
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={disabled || !inputValue.trim()}
            className="ml-3 px-3 py-1.5 rounded-md bg-[var(--chat-send-button-bg)] text-[var(--chat-send-button-text)] hover:bg-[var(--chat-send-button-bg)]/80 transition cyber-text-glow"
          >
            <SendIcon className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-medium">Send</span>
          </Button>
        </motion.div>
      </div>
      
      {/* Keyboard shortcuts hint */}
      <div className="text-[10px] text-[var(--chat-text-secondary)] mt-1 text-center">
        <span className="opacity-70">Press Enter to send, Shift+Enter for new line</span>
      </div>
    </motion.div>
  );
};
