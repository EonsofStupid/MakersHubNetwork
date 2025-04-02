
import React from 'react';

/**
 * Safely renders content that might be a React node, string, or any other type
 */
export function safelyRenderNode(content: React.ReactNode | any): React.ReactNode {
  // If it's null, undefined, or already a valid React element, return it directly
  if (content === null || content === undefined || React.isValidElement(content)) {
    return content;
  }
  
  // If it's an array, map each item (might contain React elements)
  if (Array.isArray(content)) {
    return content.map((item, index) => 
      <React.Fragment key={index}>{safelyRenderNode(item)}</React.Fragment>
    );
  }
  
  // If it's an object but not a React element, convert to string
  if (typeof content === 'object') {
    try {
      return JSON.stringify(content);
    } catch (e) {
      return '[Object]';
    }
  }
  
  // For primitive types, convert to string
  return String(content);
}

/**
 * Formats an error into a readable string
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  try {
    return JSON.stringify(error);
  } catch (e) {
    return 'Unknown error';
  }
}
