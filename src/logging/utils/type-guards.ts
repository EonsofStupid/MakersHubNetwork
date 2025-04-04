
/**
 * Generate a UUID (v4)
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Type guard to check if value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error || (
    typeof value === 'object' && 
    value !== null && 
    'message' in value &&
    typeof (value as any).message === 'string'
  );
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUUID(id: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
}

/**
 * Convert anything to safe log details
 * This prevents sensitive information from being logged and ensures
 * objects can be serialized
 */
export function toLogDetails(details: unknown): Record<string, unknown> {
  try {
    if (!details) return {};
    
    // If already an object, sanitize it
    if (typeof details === 'object' && details !== null) {
      const sanitized: Record<string, unknown> = {};
      
      // Convert to record with sanitized values
      Object.entries(details as Record<string, unknown>).forEach(([key, value]) => {
        // Skip password fields
        if (key.toLowerCase().includes('password') || 
            key.toLowerCase().includes('secret') || 
            key.toLowerCase().includes('token')) {
          sanitized[key] = '[REDACTED]';
          return;
        }
        
        // Handle Error objects
        if (isError(value)) {
          sanitized[key] = {
            name: value.name,
            message: value.message,
            stack: value.stack,
          };
          return;
        }
        
        // Handle other values
        try {
          // Test if serializable
          JSON.stringify(value);
          sanitized[key] = value;
        } catch (e) {
          // If can't be serialized, convert to string
          sanitized[key] = String(value);
        }
      });
      
      return sanitized;
    }
    
    // Convert primitive to object
    return { value: String(details) };
  } catch (e) {
    // Fallback for any unexpected issues
    return { error: 'Failed to convert to log details', originalType: typeof details };
  }
}
