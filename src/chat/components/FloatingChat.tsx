
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
  
  // Create a circuit breaker once and reuse it
  const breakerRef = useRef(new CircuitBreaker('floating-chat-render', 3, 500));
  
  useEffect(() => {
    if (renderedRef.current) return;
    renderedRef.current = true;
    
    logger.debug('FloatingChat rendered with state:', 
      withDetails({
        shouldRender, 
        isAuthenticated, 
        hasAdminAccess, 
        path: pathname 
      }));
    
    return () => {
      breakerRef.current.reset();
    };
  }, []);
  
  // Use the circuit breaker to prevent render loops
  if (breakerRef.current.count('render') > 3) {
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
