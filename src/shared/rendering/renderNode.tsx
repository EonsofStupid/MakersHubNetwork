
import React from 'react';
import { RenderOptions } from './types';

/**
 * Renders unknown values as React nodes safely
 */
export function renderUnknownAsNode(value: unknown, options?: RenderOptions): React.ReactNode {
  const { maxDepth = 3, maxLength = 1000, fallback = null } = options || {};

  if (value === null || value === undefined) {
    return <span className="text-muted-foreground italic">null</span>;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (value instanceof Error) {
    return <span className="text-destructive">{value.message}</span>;
  }
  
  if (React.isValidElement(value)) {
    return value;
  }
  
  // Handle arrays by mapping each item through renderUnknownAsNode
  if (Array.isArray(value)) {
    return (
      <span className="array-value">
        {value.map((item, index) => (
          <React.Fragment key={index}>
            {renderUnknownAsNode(item, { maxDepth: maxDepth - 1, maxLength, fallback })}
            {index < value.length - 1 && ', '}
          </React.Fragment>
        ))}
      </span>
    );
  }
  
  if (typeof value === 'object' && value !== null) {
    try {
      // Use a replacer function to handle circular references
      const seen = new WeakSet();
      const safeString = JSON.stringify(value, (key, val) => {
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) {
            return '[Circular]';
          }
          seen.add(val);
        }
        return val;
      }, 2);
      
      // Truncate if too long
      const truncatedString = safeString.length > maxLength 
        ? safeString.substring(0, maxLength) + '...'
        : safeString;
      
      return truncatedString;
    } catch (e) {
      return <span className="text-destructive">[Circular Object]</span>;
    }
  }
  
  return String(value);
}
