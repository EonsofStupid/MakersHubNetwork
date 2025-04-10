
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { ChatWidget } from './ChatWidget';
import { useLocation } from 'react-router-dom';
import { useChat } from '../context/ChatProvider';
import { useHasAdminAccess } from '@/auth/hooks/useHasRole';
import { AuthBridge } from '@/bridges/AuthBridge';
import { getLogger } from '@/logging';
import { withDetails } from '@/logging/utils/log-helpers';
import { CircuitBreaker } from '@/utils/CircuitBreaker';

export function FloatingChat() {
  const logger = getLogger();
  const location = useLocation();
  const isAuthenticated = AuthBridge.isAuthenticated();
  
  // Use our standardized hook
  const hasAdminAccess = useHasAdminAccess();
  
  const { isOpen } = useChat();
  const renderedRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(true); // Always render for all users
  
  const pathname = useMemo(() => location.pathname, [location.pathname]);
  const inChatRoute = useMemo(() => pathname.startsWith('/chat'), [pathname]);
  
  useEffect(() => {
    if (renderedRef.current) return;
    renderedRef.current = true;
    
    // Use static method or create an instance once
    const breakerInstance = new CircuitBreaker('floating-chat-render', 3, 500);
    
    logger.debug('FloatingChat rendered with state:', 
      withDetails({
        shouldRender, 
        isAuthenticated, 
        hasAdminAccess, 
        path: pathname 
      }));
    
    return () => {
      breakerInstance.reset();
    };
  }, []);
  
  // Create a circuit breaker to prevent render loops
  const tripBreaker = new CircuitBreaker('floating-chat-render', 3, 500);
  if (tripBreaker.isOpen) {
    logger.warn('Circuit breaker triggered in FloatingChat - preventing render loop');
    return null;
  }
  
  // Don't show when in a chat route to prevent duplicates
  if (inChatRoute) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ChatWidget />
    </div>
  );
}
