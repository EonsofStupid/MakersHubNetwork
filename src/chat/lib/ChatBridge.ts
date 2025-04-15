
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/shared/types/core/chat.types';
import { LogCategory, LogLevel } from '@/shared/types/core/logging.types';
import { logger } from '@/logging/logger.service';

/**
 * ChatBridge is a bridge between the UI and the chat provider
 * It manages state and communication with the chat provider
 */
export class ChatBridge {
  private static sessions: Record<string, { id: string, messages: ChatMessage[] }> = {};
  
  /**
   * Create a new session
   * @returns The new session ID
   */
  public static createSession(): string {
    const sessionId = uuidv4();
    
    this.sessions[sessionId] = {
      id: sessionId,
      messages: []
    };
    
    logger.log(LogLevel.INFO, LogCategory.CHAT, 'Created new chat session', {
      sessionId
    });
    
    return sessionId;
  }
  
  /**
   * Send a message to the chat provider
   * @param message The message content
   * @param sessionId Optional session ID
   * @returns The response message
   */
  public static async sendMessage(message: string, sessionId?: string): Promise<ChatMessage | null> {
    // Use provided session or create a new one
    const session = sessionId ? this.sessions[sessionId] : undefined;
    const actualSessionId = session?.id || this.createSession();
    
    const now = new Date().toISOString();
    
    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: message,
      sender: 'user',
      created_at: now,
      updated_at: now
    };
    
    // Add message to session
    if (this.sessions[actualSessionId]) {
      this.sessions[actualSessionId].messages.push(userMessage);
    } else {
      this.sessions[actualSessionId] = {
        id: actualSessionId,
        messages: [userMessage]
      };
    }
    
    // Log the message
    logger.log(LogLevel.INFO, LogCategory.CHAT, 'User message sent', {
      sessionId: actualSessionId,
      messageId: userMessage.id
    });
    
    try {
      // In a real implementation, this would call an API
      // For now, just simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responseTime = new Date().toISOString();
      
      // Create AI response
      const aiResponse: ChatMessage = {
        id: uuidv4(),
        content: `This is a simulated response to: "${message}"`,
        sender: 'ai',
        created_at: responseTime,
        updated_at: responseTime
      };
      
      // Add response to session
      if (this.sessions[actualSessionId]) {
        this.sessions[actualSessionId].messages.push(aiResponse);
      }
      
      // Log the response
      logger.log(LogLevel.INFO, LogCategory.CHAT, 'AI response received', {
        sessionId: actualSessionId,
        messageId: aiResponse.id
      });
      
      return aiResponse;
    } catch (error) {
      // Log any errors
      logger.log(LogLevel.ERROR, LogCategory.CHAT, 'Error in chat message processing', {
        sessionId: actualSessionId,
        error: error instanceof Error ? error.message : String(error)
      });
      
      return null;
    }
  }
  
  /**
   * Get context for a specific query
   * @param query The context query
   * @returns The context
   */
  public static async getContext(query: string): Promise<string> {
    try {
      // In a real implementation, this would fetch context from a knowledge base
      // For now, just simulate a response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      logger.log(LogLevel.DEBUG, LogCategory.CHAT, 'Retrieved context', {
        query,
        contextLength: 50
      });
      
      return `This is simulated context for the query: "${query}"`;
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.CHAT, 'Error fetching context', {
        query,
        error: error instanceof Error ? error.message : String(error)
      });
      
      return '';
    }
  }
  
  /**
   * Get messages for a session
   * @param sessionId The session ID
   * @returns Array of messages
   */
  public static getMessages(sessionId: string): ChatMessage[] {
    return this.sessions[sessionId]?.messages || [];
  }
  
  /**
   * Clear a session
   * @param sessionId The session ID
   */
  public static clearSession(sessionId: string): void {
    if (this.sessions[sessionId]) {
      this.sessions[sessionId].messages = [];
      
      logger.log(LogLevel.INFO, LogCategory.CHAT, 'Cleared chat session', {
        sessionId
      });
    }
  }
  
  /**
   * Delete a session
   * @param sessionId The session ID
   */
  public static deleteSession(sessionId: string): void {
    if (this.sessions[sessionId]) {
      delete this.sessions[sessionId];
      
      logger.log(LogLevel.INFO, LogCategory.CHAT, 'Deleted chat session', {
        sessionId
      });
    }
  }
}
