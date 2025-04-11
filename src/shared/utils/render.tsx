
import React from 'react';
import { LogEntry } from '@/logging/types';

/**
 * Utility to render unknown data types as React nodes
 */
export function renderUnknownAsNode(value: unknown): React.ReactNode {
  if (value === undefined) return <span className="text-muted-foreground">undefined</span>;
  if (value === null) return <span className="text-muted-foreground">null</span>;
  
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  
  if (value instanceof Error) {
    return (
      <div className="text-destructive">
        <p className="font-semibold">{value.name}: {value.message}</p>
        {value.stack && (
          <pre className="text-xs mt-1 p-2 bg-destructive/10 rounded overflow-auto max-h-40">
            {value.stack}
          </pre>
        )}
      </div>
    );
  }
  
  if (React.isValidElement(value)) return value;
  
  if (Array.isArray(value)) {
    return (
      <div className="space-y-1">
        {value.map((item, index) => (
          <div key={index} className="pl-2 border-l-2 border-muted">
            {renderUnknownAsNode(item)}
          </div>
        ))}
      </div>
    );
  }
  
  if (typeof value === 'object' && value !== null) {
    try {
      return (
        <pre className="text-xs p-1 bg-muted/50 rounded overflow-auto max-h-40">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    } catch (e) {
      return <span className="text-destructive">[Circular Object]</span>;
    }
  }
  
  return <span className="text-muted-foreground">[Unknown: {typeof value}]</span>;
}

/**
 * Convert React nodes or any data to searchable string for filtering
 */
export function nodeToSearchableString(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  
  if (value instanceof Error) {
    return `${value.name}: ${value.message} ${value.stack || ''}`;
  }
  
  if (React.isValidElement(value)) {
    // Extracting text content from React elements is complex
    // Just return a basic identification for now
    return '[React Element]';
  }
  
  if (Array.isArray(value)) {
    return value.map(item => nodeToSearchableString(item)).join(' ');
  }
  
  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(value);
}

/**
 * Convert an error object to a plain object for logging
 */
export function errorToObject(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { message: String(error) };
  }
  
  const errorObject: Record<string, unknown> = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
  
  // Add any custom properties from the error
  Object.getOwnPropertyNames(error).forEach(prop => {
    if (prop !== 'name' && prop !== 'message' && prop !== 'stack') {
      const key = prop as keyof typeof error;
      errorObject[prop] = error[key];
    }
  });
  
  return errorObject;
}

// Add additional helper for safe JSON stringify
export function safeStringify(obj: any): string {
  const seen = new WeakSet();
  
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  }, 2);
}

// Helper for formatting error boundary errors
export function formatErrorBoundaryError(error: Error, info: { componentStack: string }): Record<string, any> {
  return {
    error: errorToObject(error),
    componentStack: info.componentStack.split('\n').filter(Boolean)
  };
}

// Check if a value is a promise
export function isPromise(value: any): value is Promise<any> {
  return value && typeof value.then === 'function';
}

// Truncate a string to a maximum length with ellipsis
export function truncate(str: string, maxLength: number = 100): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}
