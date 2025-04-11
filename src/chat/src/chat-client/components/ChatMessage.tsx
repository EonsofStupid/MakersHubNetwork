
import React, { useState } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { chatTheme } from '../styles/theme';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/core/avatar';
import { User, Bot, Info, Copy, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/core/tooltip';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { sender, content } = message;
  const isUser = sender === 'user';
  const isSystem = sender === 'system';
  
  // Define animation variants based on sender
  const variants = {
    initial: isUser 
      ? { opacity: 0, y: 10, x: 20 }
      : isSystem 
        ? { opacity: 0, y: 10 }
        : { opacity: 0, y: 10, x: -20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 500,
        damping: 40
      } 
    },
    hover: {
      scale: 1.01,
      transition: { duration: 0.2 }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    return true;
  };

  if (isSystem) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={variants}
        className="flex justify-center my-2"
      >
        <div className={chatTheme.systemBubble}>
          <div className="flex items-center justify-center gap-2">
            <Info className="h-3 w-3 text-[var(--chat-text-secondary)]" />
            <span>{content}</span>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-3`}>
      {!isUser && (
        <div className="mr-2 mt-1">
          <Avatar className={chatTheme.botAvatar}>
            <AvatarImage src="/bot-avatar.png" alt="MakersImpulse AI" />
            <AvatarFallback className="bg-transparent border border-[var(--chat-primary-accent)]">
              <Bot className="h-4 w-4 text-[var(--chat-primary-accent)]" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={variants}
        className={isUser ? chatTheme.userBubble : chatTheme.aiBubble}
      >
        {isUser ? (
          <p className="break-words">{content}</p>
        ) : (
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                // Check if this is an inline code block
                const match = /language-(\w+)/.exec(className || '');
                const isInlineCode = !match;
                const [copied, setCopied] = useState(false);
                
                const handleCopy = () => {
                  if (copyToClipboard(String(children))) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                };
                
                if (isInlineCode) {
                  return (
                    <code className="bg-black/20 dark:bg-white/10 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                } else {
                  return (
                    <div className={`${chatTheme.codeBlock} code-block`}>
                      <div className={chatTheme.codeHeader}>
                        <span>{match ? match[1] : 'code'}</span>
                      </div>
                      <pre className="p-4 overflow-x-auto text-sm">
                        <code className={className} {...props}>
                          {children}
                        </code>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                className={chatTheme.copyButton}
                                onClick={handleCopy}
                              >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copied ? 'Copied!' : 'Copy code'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </pre>
                    </div>
                  );
                }
              },
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              }
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </motion.div>

      {isUser && (
        <div className="ml-2 mt-1">
          <Avatar className={chatTheme.userAvatar}>
            <AvatarFallback className="bg-[var(--chat-bubble-user-from)] text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};
