
import { useCallback } from 'react';
import { useChatStore } from '../state/chatStore';
import { useChatBridge } from '../lib/chatBridge';
import { getRagContext } from '../lib/ragClient';
import { sendMessageToModel } from '../lib/orchestrator';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook that manages the chat session, including sending messages, loading states, 
 * and integrating with RAG and model selection
 */
export const useChatSession = () => {
  const { 
    messages, 
    isLoading, 
    mode, 
    addMessage, 
    setIsLoading, 
    setMode 
  } = useChatStore();
  
  const bridge = useChatBridge();
  
  // Function to send messages to AI
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to the chat
    addMessage({ sender: 'user', content });
    
    // Set loading state
    setIsLoading(true);
    
    try {
      console.log(`Processing message in ${mode} mode for project ${bridge.projectContext.id}`);
      
      // Get relevant context based on project ID and user message
      // This provides tailored context for each query using RAG
      console.log('Retrieving RAG context...');
      const context = await getRagContext(bridge.projectContext.id, content);
      console.log(`Retrieved context of length: ${context.length}`);
      
      // Send message to model with context and mode
      // Mode determines which LLM to use (GPT for developer modes, Claude for chat/training)
      console.log(`Sending message to ${mode} model with context`);
      const response = await sendMessageToModel({ 
        message: content, 
        context, 
        mode 
      });
      
      // Add AI response to chat
      addMessage({ sender: 'ai', content: response });
      
      console.log('Message processing complete');
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      addMessage({ 
        sender: 'ai', 
        content: 'Sorry, I encountered an error processing your request.' 
      });
      
      // Show toast notification
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  }, [addMessage, bridge.projectContext.id, mode, setIsLoading]);
  
  return {
    messages,
    isLoading,
    sendMessage,
    mode,
    setMode
  };
};
