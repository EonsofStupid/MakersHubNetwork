
/**
 * Shared types used across modules
 */

// Auth status types
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

// Common result types
export interface Result<T> {
  data?: T;
  error?: Error;
  success: boolean;
}

// Theme related types
export interface ThemeLogDetails {
  success?: boolean;
  error?: Error;
  errorMessage?: string;
  theme?: string;
  details?: Record<string, unknown>;
}

// Chat message type
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  sessionId: string;
  metadata?: Record<string, any>;
}
