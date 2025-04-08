
import React, { useEffect, useRef, useMemo } from 'react';
import { ChatWidget } from './ChatWidget';
import { useLocation } from 'react-router-dom';
import { useChat } from '../context/ChatProvider';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useAuthState } from '@/auth/hooks/useAuthState';

export function FloatingChat() {
  const location = useLocation();
  const { isAuthenticated } = useAuthState();
  const { hasAdminAccess } = useAdminAccess();
  const { isOpen } = useChat();
  const renderedRef = useRef(false);
  
  // Memoize the check to prevent unnecessary re-renders
  const shouldShow = useMemo(() => {
    // Only check if we're authenticated and have admin access
    if (!isAuthenticated || !hasAdminAccess) {
      return false;
    }
    
    // Don't show on chat routes to avoid duplication
    const pathname = location.pathname;
    return !pathname.startsWith('/chat');
  }, [isAuthenticated, hasAdminAccess, location.pathname]);
  
  // Add debug logging
  useEffect(() => {
    if (!renderedRef.current) {
      console.log('FloatingChat rendered with state:', { 
        shouldShow, 
        isAuthenticated, 
        hasAdminAccess, 
        path: location.pathname 
      });
      renderedRef.current = true;
    }
  }, [shouldShow, isAuthenticated, hasAdminAccess, location.pathname]);
  
  if (!shouldShow) {
    return null;
  }
  
  return <ChatWidget />;
}
