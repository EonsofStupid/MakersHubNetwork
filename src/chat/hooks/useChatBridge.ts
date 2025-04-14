
import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChatBridge } from '../lib/ChatBridge';
import { LogCategory, LogLevel } from '@/shared/types';
import { useLogger } from '@/logging/hooks/use-logger';

/**
 * Hook to interact with the ChatBridge
 */
export function useChatBridge() {
  const logger = useLogger('useChatBridge', LogCategory.CHAT);
  
  // Send a chat message
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ message, sessionId }: { message: string; sessionId?: string }) => {
      logger.debug('Sending message to ChatBridge', { 
        details: { messageLength: message.length, sessionId }
      });
      return ChatBridge.sendMessage(message, sessionId);
    },
    onSuccess: (data) => {
      logger.debug('Message sent successfully', { 
        details: { responseLength: data?.content?.length || 0 }
      });
    },
    onError: (error) => {
      logger.error('Error sending message', { 
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  });
  
  // Get chat context for a query
  const { data: context, refetch: loadContext, isLoading: isLoadingContext } = useQuery({
    queryKey: ['chatContext'],
    queryFn: async () => {
      return '';
    },
    enabled: false, // Don't fetch on mount
  });
  
  // Load context with a specific query
  const getContext = useCallback(async (query: string) => {
    logger.debug('Loading context for query', { details: { query } });
    try {
      const result = await ChatBridge.getContext(query);
      return result || '';
    } catch (error) {
      logger.error('Error loading context', { 
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      return '';
    }
  }, [logger]);
  
  return {
    sendMessage,
    isLoading: isPending,
    context: context || '',
    loadContext: getContext,
    isLoadingContext
  };
}
