
import { useCallback, useRef } from 'react';
import { getLogger } from '@/logging';
import { LogCategory, LogLevel } from '@/logging/types';

interface RequestLogOptions {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  tags?: string[];
}

interface ResponseLogOptions {
  status: number;
  statusText: string;
  headers?: Record<string, string>;
  body?: any;
  duration: number;
  tags?: string[];
}

/**
 * Hook for logging network requests and responses
 */
export function useNetworkLogger(source: string) {
  const logger = getLogger();
  const requestTimers = useRef<Record<string, number>>({});
  
  /**
   * Generate a unique ID for tracking requests
   */
  const generateRequestId = useCallback(() => {
    return Math.random().toString(36).substring(2, 15);
  }, []);
  
  /**
   * Log the start of a network request
   */
  const logRequest = useCallback((requestId: string, options: RequestLogOptions) => {
    // Start timer
    requestTimers.current[requestId] = performance.now();
    
    // Log the request
    logger.info(`Request: ${options.method} ${options.url}`, {
      category: LogCategory.NETWORK,
      source,
      details: {
        requestId,
        method: options.method,
        url: options.url,
        headers: options.headers,
        body: options.body
      },
      tags: [...(options.tags || []), 'request']
    });
    
    return requestId;
  }, [logger, source]);
  
  /**
   * Log the completion of a network request
   */
  const logResponse = useCallback((requestId: string, options: ResponseLogOptions) => {
    // Calculate duration
    const startTime = requestTimers.current[requestId];
    const duration = startTime ? performance.now() - startTime : options.duration;
    
    // Determine log level based on status code
    let level = LogLevel.INFO;
    if (options.status >= 400 && options.status < 500) {
      level = LogLevel.WARNING;
    } else if (options.status >= 500) {
      level = LogLevel.ERROR;
    }
    
    // Log the response
    logger.log(level, `Response (${options.status}): ${options.duration.toFixed(0)}ms`, {
      category: LogCategory.NETWORK,
      source,
      details: {
        requestId,
        status: options.status,
        statusText: options.statusText,
        headers: options.headers,
        body: options.body,
        duration
      },
      duration,
      tags: [...(options.tags || []), 'response']
    });
    
    // Clean up timer
    delete requestTimers.current[requestId];
  }, [logger, source]);
  
  /**
   * Log a network error
   */
  const logNetworkError = useCallback((requestId: string, error: Error, options: RequestLogOptions) => {
    // Calculate duration if possible
    const startTime = requestTimers.current[requestId];
    const duration = startTime ? performance.now() - startTime : 0;
    
    // Log the error
    logger.error(`Network Error: ${options.method} ${options.url}`, {
      category: LogCategory.NETWORK,
      source,
      details: {
        requestId,
        error: error.message,
        stack: error.stack,
        method: options.method,
        url: options.url,
        duration
      },
      duration,
      tags: [...(options.tags || []), 'error']
    });
    
    // Clean up timer
    delete requestTimers.current[requestId];
  }, [logger, source]);
  
  /**
   * Create a wrapped fetch function that logs requests/responses
   */
  const loggedFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const requestId = generateRequestId();
    const method = options.method || 'GET';
    
    // Log the request
    logRequest(requestId, {
      url,
      method,
      headers: options.headers as Record<string, string>,
      body: options.body
    });
    
    try {
      // Make the actual request
      const response = await fetch(url, options);
      
      // Log the response
      logResponse(requestId, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        duration: performance.now() - requestTimers.current[requestId]
      });
      
      return response;
    } catch (error) {
      // Log any network errors
      if (error instanceof Error) {
        logNetworkError(requestId, error, {
          url,
          method
        });
      }
      
      throw error;
    }
  }, [generateRequestId, logRequest, logResponse, logNetworkError]);
  
  return {
    logRequest,
    logResponse,
    logNetworkError,
    loggedFetch,
    generateRequestId
  };
}
