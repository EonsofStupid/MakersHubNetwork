
import { useCallback } from 'react';
import { getLogger } from '../service/logger.service';
import { LogCategory } from '../types';
import { usePerformanceLogger } from './usePerformanceLogger';

/**
 * Hook for logging network requests
 */
export function useNetworkLogger(source: string = 'API') {
  const logger = getLogger(source);
  const { measureAsync } = usePerformanceLogger(source);
  
  /**
   * Log a fetch request
   */
  const logFetch = useCallback(async <T>(
    url: string, 
    options?: RequestInit,
    customConfig?: {
      name?: string;
      includeResponse?: boolean;
      sensitiveKeys?: string[];
    }
  ): Promise<T> => {
    const requestName = customConfig?.name || `${options?.method || 'GET'} ${url}`;
    
    // Filter out sensitive data
    const sanitizedOptions = { ...options };
    if (sanitizedOptions.headers && customConfig?.sensitiveKeys) {
      const sanitizedHeaders = { ...sanitizedOptions.headers };
      for (const key of customConfig.sensitiveKeys) {
        if (key in sanitizedHeaders) {
          sanitizedHeaders[key] = '[REDACTED]';
        }
      }
      sanitizedOptions.headers = sanitizedHeaders;
    }
    
    // Log request
    logger.info(`Request: ${requestName}`, {
      category: LogCategory.NETWORK,
      details: {
        url,
        method: options?.method || 'GET',
        headers: sanitizedOptions.headers
      }
    });
    
    // Perform and measure the fetch request
    return measureAsync(
      requestName,
      async () => {
        try {
          const response = await fetch(url, options);
          const isJson = response.headers.get('content-type')?.includes('application/json');
          
          let responseData: any;
          try {
            responseData = isJson ? await response.json() : await response.text();
          } catch (parseError) {
            responseData = { parseError: String(parseError) };
          }
          
          if (!response.ok) {
            const error = {
              status: response.status,
              statusText: response.statusText,
              data: responseData
            };
            
            logger.error(`Request failed: ${requestName}`, {
              category: LogCategory.NETWORK,
              details: {
                url,
                method: options?.method || 'GET',
                status: response.status,
                error
              }
            });
            
            throw error;
          }
          
          // Log successful response
          logger.info(`Response: ${requestName}`, {
            category: LogCategory.NETWORK,
            details: customConfig?.includeResponse ? {
              url,
              status: response.status,
              data: responseData
            } : {
              url,
              status: response.status
            }
          });
          
          return responseData;
        } catch (error) {
          // If it's not our own error object, log it
          if (!(error as any).status) {
            logger.error(`Network error: ${requestName}`, {
              category: LogCategory.NETWORK,
              details: {
                url,
                method: options?.method || 'GET',
                error
              }
            });
          }
          
          throw error;
        }
      },
      { category: LogCategory.NETWORK }
    );
  }, [logger, measureAsync]);

  return {
    logFetch
  };
}
