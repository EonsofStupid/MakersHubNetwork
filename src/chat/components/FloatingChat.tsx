
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { ChatWidget } from './ChatWidget';
import { useLocation } from 'react-router-dom';
import { useChat } from '../context/ChatProvider';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { getLogger } from '@/logging';
import CircuitBreaker from '@/utils/CircuitBreaker';

export function FloatingChat() {
  const logger = getLogger('FloatingChat');
  const location = useLocation();
  const { isAuthenticated } = useAuthState();
  const { hasAdminAccess } = useAdminAccess();
  const { isOpen } = useChat();
  const renderedRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  // Use memoized values with stable references
  const pathname = useMemo(() => location.pathname, [location.pathname]);
  const inChatRoute = useMemo(() => pathname.startsWith('/chat'), [pathname]);
  const canShow = useMemo(() => isAuthenticated && hasAdminAccess && !inChatRoute, 
    [isAuthenticated, hasAdminAccess, inChatRoute]);
  
  // Handle initial render and prevent render loops
  useEffect(() => {
    // Initialize the circuit breaker for this component
    CircuitBreaker.init('floating-chat-render', 3, 500);
    
    if (renderedRef.current) {
      return;
    }
    
    // Record first render
    renderedRef.current = true;
    logger.debug('FloatingChat rendered with state:', { 
      canShow, 
      isAuthenticated, 
      hasAdminAccess, 
      path: pathname 
    });
    
    // Safely update state based on props
    setShouldRender(canShow);
    
    return () => {
      CircuitBreaker.reset('floating-chat-render');
    };
  }, [canShow, isAuthenticated, hasAdminAccess, pathname, logger]);
  
  // Check for render loops
  if (CircuitBreaker.count('floating-chat-render')) {
    logger.warn('Circuit breaker triggered in FloatingChat - preventing render loop');
    return null;
  }
  
  if (!shouldRender) {
    return null;
  }
  
  return <ChatWidget />;
}
