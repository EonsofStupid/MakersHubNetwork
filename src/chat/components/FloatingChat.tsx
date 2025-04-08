
import React from 'react';
import { ChatWidget } from './ChatWidget';
import { useRouter } from '@/router';
import { useChat } from '../context/ChatProvider';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useAuthState } from '@/auth/hooks/useAuthState';

export function FloatingChat() {
  const router = useRouter();
  const { isAuthenticated } = useAuthState();
  const { hasAdminAccess } = useAdminAccess();
  const { isOpen } = useChat();
  
  // Only show in certain paths and for authenticated users with admin access
  const shouldShowChat = () => {
    if (!isAuthenticated) return false;
    if (!hasAdminAccess) return false;
    
    const pathname = router?.state?.location?.pathname || '';
    
    // Don't show on chat routes to avoid duplication
    if (pathname.startsWith('/chat')) return false;
    
    return true;
  };
  
  if (!shouldShowChat()) {
    return null;
  }
  
  return <ChatWidget />;
}
