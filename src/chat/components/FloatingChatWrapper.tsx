
import React from 'react';
import { FloatingChat } from './FloatingChat';
import { CircuitBreaker } from '@/utils/CircuitBreaker';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

export function FloatingChatWrapper() {
  const logger = getLogger();
  
  // Create a circuit breaker
  const breaker = new CircuitBreaker('floating-chat-wrapper', 3, 1000);
  
  try {
    // Count the render attempt
    const renderCount = breaker.count('render');
    
    if (renderCount > 3) {
      logger.warn('Circuit breaker triggered in FloatingChatWrapper', {
        category: LogCategory.CHAT,
        details: { renderCount }
      });
      return null;
    }
    
    // Render the FloatingChat component
    return <FloatingChat />;
  } catch (error) {
    logger.error('Error rendering FloatingChat', {
      category: LogCategory.CHAT,
      details: { error }
    });
    return null;
  }
}

export default FloatingChatWrapper;
