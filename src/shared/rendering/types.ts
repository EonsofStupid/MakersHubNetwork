
import { ReactNode } from 'react';

/**
 * Common types for rendering utilities
 */

export interface RenderOptions {
  maxDepth?: number;
  maxLength?: number;
  fallback?: ReactNode;
}

export interface StringifyOptions {
  maxDepth?: number;
  maxLength?: number;
  fallback?: string;
  handleCircular?: boolean;
}
