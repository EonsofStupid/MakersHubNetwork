
import { useEffect, useCallback } from 'react';
import { adminChatBridge } from '../utils/chatBridge';

type MessageHandler = (message: any) => void;

/**
 * React hook for interacting with the admin chat bridge
 */
export function useAdminChat(channel: string) {
  const publishMessage = useCallback(
    (message: any) => {
      adminChatBridge.publish(channel, message);
    },
    [channel]
  );
  
  const subscribeToChannel = useCallback(
    (handler: MessageHandler) => {
      return adminChatBridge.subscribe(channel, handler);
    },
    [channel]
  );
  
  return {
    publish: publishMessage,
    subscribe: subscribeToChannel
  };
}

/**
 * React hook for subscribing to admin messages with automatic cleanup
 */
export function useAdminChatListener(channel: string, handler: MessageHandler) {
  useEffect(() => {
    // Subscribe to channel and get unsubscribe function
    const unsubscribe = adminChatBridge.subscribe(channel, handler);
    
    // Clean up on unmount
    return unsubscribe;
  }, [channel, handler]);
}
