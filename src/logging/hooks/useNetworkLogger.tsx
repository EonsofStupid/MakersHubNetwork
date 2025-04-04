
import { useCallback } from 'react';
import { useLogger } from './useLogger';
import { LogLevel, LogCategory } from '../types';

/**
 * Hook to provide network request and response logging
 */
export const useNetworkLogger = () => {
  // Fix: Correctly use LogCategory.NETWORK enum value
  const logger = useLogger('NetworkLogger', { category: LogCategory.NETWORK });
  
  /**
   * Sanitize headers to avoid logging sensitive info
   */
  const sanitizeHeaders = (headers: any) => {
    if (!headers) return {};
    
    const sanitized: Record<string, string> = {};
    const sensitiveKeys = ['authorization', 'cookie', 'token', 'key', 'secret', 'password'];
    
    Object.keys(headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = headers[key];
      }
    });
    
    return sanitized;
  };
  
  /**
   * Determine if request/response body should be logged
   */
  const shouldLogBody = (url: string) => {
    // Don't log large binary data or potentially sensitive endpoints
    const excludePatterns = [
      '/upload',
      '/media',
      '/image',
      '/file',
      '/auth/',
      '/password'
    ];
    
    return !excludePatterns.some(pattern => url.includes(pattern));
  };

  /**
   * Log a network request
   */
  const logRequest = useCallback(
    (config: any) => {
      const { url, method, headers, params, data } = config;
      
      // Create a clean object with just the essentials for logging
      const logData = {
        url,
        method: method?.toUpperCase() || 'GET',
        headers: sanitizeHeaders(headers),
        params,
        data: shouldLogBody(url) ? data : '[REDACTED]',
      };
      
      logger.debug(`API Request: ${method?.toUpperCase() || 'GET'} ${url}`, { details: logData });
      
      return config;
    },
    [logger]
  );

  /**
   * Log a response
   */
  const logResponse = useCallback(
    (response: any) => {
      const { config, status, statusText, headers, data } = response;
      const { url, method } = config || {};
      
      // Create a clean object with just the essentials for logging
      const logData = {
        url,
        method: method?.toUpperCase() || 'GET',
        status,
        statusText,
        headers: sanitizeHeaders(headers),
        data: shouldLogBody(url) ? data : '[REDACTED]',
      };
      
      // Fix: use response.status to determine log level
      const level = response.status >= 400 ? LogLevel.WARN : LogLevel.DEBUG;
      const message = `API Response: ${status} ${statusText} for ${method?.toUpperCase() || 'GET'} ${url}`;
      
      logger.log(level, message, { details: logData });
      
      return response;
    },
    [logger]
  );

  /**
   * Log an error response
   */
  const logError = useCallback(
    (error: any) => {
      const config = error.config || {};
      const { url, method } = config;
      
      // Create a clean object with just the essentials for logging
      const logData = {
        url,
        method: method?.toUpperCase() || 'GET',
        message: error.message,
        code: error.code,
        stack: error.stack,
      };
      
      logger.error(`API Error: ${error.message} for ${method?.toUpperCase() || 'GET'} ${url || 'unknown'}`, { details: logData });
      
      return Promise.reject(error);
    },
    [logger]
  );

  return {
    logRequest,
    logResponse,
    logError
  };
};
