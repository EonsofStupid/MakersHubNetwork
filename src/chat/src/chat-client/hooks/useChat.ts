
import { useState } from 'react';
import { ragClient } from '../lib/ragClient';

export function useChat(sessionId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message to state
      setMessages(prev => [...prev, { role: 'user', content }]);
      
      // Get context from RAG if available
      let context = '';
      try {
        context = await ragClient.getRagContext(content);
      } catch (error) {
        console.warn('Error getting RAG context:', error);
      }
      
      // Simulate response with context
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: context 
            ? `This is a response with context: ${context.substring(0, 100)}...` 
            : 'This is a placeholder response from the chat system.' 
        }]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };
  
  return {
    messages,
    sendMessage,
    isLoading
  };
}
