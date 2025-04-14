/**
 * Main types barrel file
 * Simplified exports to avoid naming conflicts
 */

// Export shared types directly, which contains most of the common types
export * from './shared.types';

// Export feature-specific types that don't overlap with shared types
export * from './features/review.types';
export * from './features/layout.types';
export * from './features/chat.types';
