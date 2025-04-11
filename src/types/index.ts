
/**
 * Central types export
 * 
 * This file re-exports all shared types from their specific modules.
 * This prevents circular dependencies and provides a single source of truth.
 */

// Auth types
export * from './auth.types';

// User types - explicitly resolve conflicts
export type { User } from './user';
export type { UserMetadata } from './user.types';

// Re-export from user.ts to avoid conflicts
export * from './user';

// Shared types
export * from './shared';

// Logging types
export * from '@/logging/types';

// Chat types
export type {
  ChatMessage,
  ChatEvent,
  ChatEventType,
  ChatMessageType,
  ChatSessionOptions
} from '@/bridges/ChatBridge';

// Core types
export type {
  MessageHandler,
  MessageChannel,
  UnsubscribeFn
} from '@/core/MessageBus';
