
import { useState, useEffect, useCallback } from 'react';
import { chatBridge, ChatBridgeChannel } from '../lib/ChatBridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

type MessageHandler = (message: any) => void;

interface UseChatBridgeOptions {
  onMessage?: MessageHandler;
  channel: ChatBridgeChannel;
}

export function useChatBridge({ onMessage, channel }: UseChatBridgeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const logger = useLogger('useChatBridge', LogCategory.CHAT);
  
  // Create a stable message handler
  const handleMessage = useCallback((message: any) => {
    if (onMessage) {
      onMessage(message);
    }
  }, [onMessage]);
  
  useEffect(() => {
    logger.info(`Connecting to chat bridge channel: ${channel}`);
    
    // Subscribe to the channel
    const unsubscribe = chatBridge.subscribe(channel, handleMessage);
    
    // Set as connected
    setIsConnected(true);
    
    // Clean up subscription
    return () => {
      logger.info(`Disconnecting from chat bridge channel: ${channel}`);
      unsubscribe();
      setIsConnected(false);
    };
  }, [channel, handleMessage, logger]);
  
  // Publish to the channel
  const publish = useCallback((message: any) => {
    if (!isConnected) {
      logger.warn(`Attempted to publish to channel ${channel} before connection`);
      return;
    }
    
    chatBridge.publish(channel, message);
  }, [channel, isConnected, logger]);
  
  return {
    isConnected,
    publish
  };
}
