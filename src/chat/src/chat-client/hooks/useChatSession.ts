
import { useState, useEffect } from 'react';
import { useChat } from './useChat';
import { ragClient } from '../lib/ragClient';

/**
 * Hook for managing a chat session with RAG context
 */
export function useChatSession(sessionId?: string) {
  const chat = useChat(sessionId);
  const [context, setContext] = useState<string>('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  
  const loadContext = async (query: string) => {
    try {
      setIsLoadingContext(true);
      const ragContext = await ragClient.getRagContext(query);
      setContext(ragContext);
      return ragContext;
    } catch (error) {
      console.error('Error loading RAG context:', error);
      return '';
    } finally {
      setIsLoadingContext(false);
    }
  };
  
  return {
    ...chat,
    context,
    loadContext,
    isLoadingContext
  };
}
