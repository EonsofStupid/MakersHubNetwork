
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { ChatWidget } from './ChatWidget';
import { useLocation } from 'react-router-dom';
import { useChat } from '../context/ChatProvider';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { getLogger } from '@/logging';
import { withDetails } from '@/logging/utils/log-helpers';
import CircuitBreaker from '@/utils/CircuitBreaker';
import { subscribeToAuthEvents } from '@/auth/bridge';

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
  
  // Handle initial render with circuit breaker to prevent render loops
  useEffect(() => {
    if (renderedRef.current) return;
    renderedRef.current = true;
    
    // Initialize circuit breaker for this component
    CircuitBreaker.init('floating-chat-render', 3, 500);
    
    logger.debug('FloatingChat rendered with state:', 
      withDetails({
        canShow, 
        isAuthenticated, 
        hasAdminAccess, 
        path: pathname 
      }));
    
    // Subscribe to auth events
    const unsubscribe = subscribeToAuthEvents((event) => {
      // Just check the conditions again - don't update state directly from auth events
      const shouldShow = isAuthenticated && hasAdminAccess && !pathname.startsWith('/chat');
      if (shouldShow !== shouldRender) {
        setShouldRender(shouldShow);
      }
    });
    
    // Safely update state based on props
    setShouldRender(canShow);
    
    return () => {
      CircuitBreaker.reset('floating-chat-render');
      unsubscribe();
    };
  }, []);
  
  // Separate effect for updates to prevent re-render loops
  useEffect(() => {
    if (!renderedRef.current) return;
    
    // Only update if the component has already done its first render
    if (CircuitBreaker.getCount('floating-chat-render') > 1) {
      // Update the render state based on latest values, but don't cause a loop
      const newShouldRender = canShow;
      if (newShouldRender !== shouldRender) {
        setShouldRender(newShouldRender);
      }
    }
  }, [canShow, shouldRender]);
  
  // Check for render loops
  if (CircuitBreaker.isTripped('floating-chat-render')) {
    logger.warn('Circuit breaker triggered in FloatingChat - preventing render loop');
    return null;
  }
  
  if (!shouldRender) {
    return null;
  }
  
  return <ChatWidget />;
}
