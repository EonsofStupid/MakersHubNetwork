import React, { useEffect, useRef, useMemo, useState } from 'react';
import { ChatWidget } from './ChatWidget';
import { useLocation } from 'react-router-dom';
import { useChat } from '../context/ChatProvider';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { getLogger } from '@/logging';
import { withDetails } from '@/logging/utils/log-helpers';
import { CircuitBreaker } from '@/utils/CircuitBreaker';
import { subscribeToAuthEvents } from '@/auth/bridge';

export function FloatingChat() {
  const logger = getLogger();
  const location = useLocation();
  const { isAuthenticated } = useAuthState();
  const { hasAdminAccess } = useAdminAccess();
  const { isOpen } = useChat();
  const renderedRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  const pathname = useMemo(() => location.pathname, [location.pathname]);
  const inChatRoute = useMemo(() => pathname.startsWith('/chat'), [pathname]);
  
  const canShow = useMemo(() => isAuthenticated && hasAdminAccess && !inChatRoute, 
    [isAuthenticated, hasAdminAccess, inChatRoute]);
  
  useEffect(() => {
    if (renderedRef.current) return;
    renderedRef.current = true;
    
    const breakerInstance = new CircuitBreaker('floating-chat-render', 3, 500);
    
    logger.debug('FloatingChat rendered with state:', 
      withDetails({
        canShow, 
        isAuthenticated, 
        hasAdminAccess, 
        path: pathname 
      }));
    
    const unsubscribe = subscribeToAuthEvents((event) => {
      const shouldShow = isAuthenticated && hasAdminAccess && !pathname.startsWith('/chat');
      if (shouldShow !== shouldRender) {
        setShouldRender(shouldShow);
      }
    });
    
    setShouldRender(canShow);
    
    return () => {
      breakerInstance.reset();
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    if (!renderedRef.current) return;
    
    const breaker = new CircuitBreaker('floating-chat-render', 3, 500);
    if (breaker.count('floating-chat-render') > 1) {
      const newShouldRender = canShow;
      if (newShouldRender !== shouldRender) {
        setShouldRender(newShouldRender);
      }
    }
  }, [canShow, shouldRender]);
  
  const tripBreaker = new CircuitBreaker('floating-chat-render', 3, 500);
  if (tripBreaker.isOpen) {
    logger.warn('Circuit breaker triggered in FloatingChat - preventing render loop');
    return null;
  }
  
  if (!shouldRender) {
    return null;
  }
  
  return <ChatWidget />;
}
