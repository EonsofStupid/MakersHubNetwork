
/**
 * Safely prepare error details for logging
 * 
 * Handles circular references, sensitive data filtering,
 * and converting Error objects to serializable format
 */
export function safeDetails(details: unknown): Record<string, unknown> {
  try {
    // Return empty object for null/undefined
    if (details == null) return {};
    
    // Handle Error objects
    if (details instanceof Error) {
      const errorObj: Record<string, unknown> = {
        message: details.message,
        name: details.name,
      };
      
      // Include stack in development
      if (process.env.NODE_ENV === 'development' && details.stack) {
        errorObj.stack = details.stack;
      }
      
      // Include cause if present
      if ('cause' in details && details.cause) {
        errorObj.cause = safeDetails(details.cause);
      }
      
      // Include custom properties
      Object.getOwnPropertyNames(details).forEach(key => {
        if (!['message', 'name', 'stack'].includes(key)) {
          try {
            errorObj[key] = (details as any)[key];
          } catch (e) {
            errorObj[key] = '[Error accessing property]';
          }
        }
      });
      
      return errorObj;
    }
    
    // If details is already a simple type, wrap it
    if (typeof details !== 'object' || details === null) {
      return { value: details };
    }
    
    // Clone to avoid circular references and handle specialized objects
    return JSON.parse(JSON.stringify(details, replacer));
  } catch (err) {
    // Fallback for any issues processing details
    return { 
      error: 'Error processing details for logging',
      originalType: typeof details
    };
  }
}

// Custom JSON replacer to handle circular references and sensitive data
function replacer(key: string, value: any): any {
  // Filter sensitive keys
  if (isLikelySensitive(key)) {
    return '[REDACTED]';
  }
  
  // Handle special types
  if (value instanceof Set) {
    return ['[Set]', ...Array.from(value)];
  }
  
  if (value instanceof Map) {
    return ['[Map]', Object.fromEntries(value)];
  }
  
  // Handle functions
  if (typeof value === 'function') {
    return '[Function]';
  }
  
  // Return other values normally
  return value;
}

// Detect potentially sensitive data keys
function isLikelySensitive(key: string): boolean {
  const sensitivePatterns = [
    /password/i,
    /token/i,
    /secret/i,
    /key/i,
    /credential/i,
    /auth/i,
    /login/i,
    /ssn/i,
    /social.*security/i,
    /credit.*card/i,
    /card.*number/i,
    /cvv/i,
    /passphrase/i
  ];
  
  return sensitivePatterns.some(pattern => pattern.test(key));
}
