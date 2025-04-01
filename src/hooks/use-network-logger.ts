
import { useCallback } from 'react';
import { getLogger, LogCategory, LogLevel } from '@/logging';
import { usePerformanceLogger } from './use-performance-logger';

/**
 * Hook for logging network requests
 */
export function useNetworkLogger(source: string) {
  const logger = getLogger();
  const { startTimer, endTimer } = usePerformanceLogger(source);
  
  /**
   * Log a network request (fetch, axios, etc)
   */
  const logRequest = useCallback((options: {
    url: string;
    method: string;
    requestData?: unknown;
    status?: number;
    responseData?: unknown;
    error?: unknown;
    duration?: number;
    tags?: string[];
  }) => {
    const {
      url,
      method,
      requestData,
      status,
      responseData,
      error,
      duration,
      tags
    } = options;
    
    // Determine log level based on status and error
    let level = LogLevel.INFO;
    if (error || (status && status >= 500)) {
      level = LogLevel.ERROR;
    } else if (status && status >= 400) {
      level = LogLevel.WARNING;
    } else if (status && status >= 300 && status < 400) {
      level = LogLevel.INFO;
    }
    
    // Create a message
    let message = `${method} ${url}`;
    if (status) {
      message += ` - ${status}`;
    }
    if (error) {
      message += ` - Error: ${error instanceof Error ? error.message : String(error)}`;
    }
    if (duration) {
      message += ` (${duration.toFixed(2)}ms)`;
    }
    
    // Build details object
    const details = {
      url,
      method,
      ...(requestData ? { requestData } : {}),
      ...(status ? { status } : {}),
      ...(responseData ? { responseData } : {}),
      ...(error ? { error } : {}),
      ...(duration ? { duration } : {})
    };
    
    // Log with appropriate level
    switch (level) {
      case LogLevel.ERROR:
        logger.error(message, {
          category: LogCategory.NETWORK,
          details,
          source,
          tags
        });
        break;
      case LogLevel.WARNING:
        logger.warn(message, {
          category: LogCategory.NETWORK,
          details,
          source,
          tags
        });
        break;
      default:
        logger.info(message, {
          category: LogCategory.NETWORK,
          details,
          source,
          tags
        });
    }
  }, [logger, source]);
  
  /**
   * Wrapper for fetch API with logging
   */
  const fetchWithLogging = useCallback(async (
    url: string,
    options?: RequestInit
  ): Promise<Response> => {
    const method = options?.method || 'GET';
    const requestId = `${method}-${url}-${Date.now()}`;
    
    startTimer(requestId);
    
    try {
      const response = await fetch(url, options);
      
      // Clone the response to read the body without consuming it
      let responseData: unknown;
      try {
        const clonedResponse = response.clone();
        const contentType = clonedResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await clonedResponse.json();
        } else {
          responseData = await clonedResponse.text();
        }
      } catch (e) {
        responseData = 'Could not parse response';
      }
      
      const duration = endTimer(requestId);
      
      // Extract request data if available
      let requestData: unknown;
      if (options?.body) {
        try {
          if (typeof options.body === 'string') {
            requestData = JSON.parse(options.body);
          } else {
            requestData = options.body;
          }
        } catch (e) {
          requestData = options.body;
        }
      }
      
      // Log the request
      logRequest({
        url,
        method,
        requestData,
        status: response.status,
        responseData,
        duration,
        tags: ['fetch']
      });
      
      return response;
    } catch (error) {
      const duration = endTimer(requestId);
      
      // Log the error
      logRequest({
        url,
        method,
        error,
        duration,
        tags: ['fetch', 'error']
      });
      
      throw error;
    }
  }, [startTimer, endTimer, logRequest]);
  
  return {
    logRequest,
    fetchWithLogging
  };
}
