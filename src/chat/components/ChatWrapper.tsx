
import React, { ReactNode } from 'react';

interface ChatWrapperProps {
  children: ReactNode;
  isFloating?: boolean;
  isMobile?: boolean;
  isExpanded?: boolean;
}

/**
 * Wrapper component for chat interface
 */
export const ChatWrapper: React.FC<ChatWrapperProps> = ({
  children,
  isFloating = false,
  isMobile = false,
  isExpanded = false
}) => {
  // Determine classes based on props
  const wrapperClasses = isFloating
    ? 'fixed bottom-4 right-4 z-50 shadow-lg rounded-lg overflow-hidden'
    : 'h-full w-full';
    
  const sizeClasses = isFloating
    ? isExpanded
      ? isMobile
        ? 'w-[calc(100%-2rem)] h-[80vh]'
        : 'w-[400px] h-[600px]'
      : 'w-[350px] h-[55px]'
    : 'w-full h-full';
    
  return (
    <div className={`bg-background flex flex-col ${wrapperClasses} ${sizeClasses} transition-all duration-300`}>
      {children}
    </div>
  );
};

export default ChatWrapper;
