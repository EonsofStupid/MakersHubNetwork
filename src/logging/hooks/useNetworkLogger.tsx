
import { useCallback } from 'react';
import { getLogger } from '../service/logger.service';
import { LogCategory } from '../types';
import { usePerformanceLogger } from './usePerformanceLogger';
import { toLogDetails } from '../utils/type-guards';

export function useNetworkLogger(source: string = 'API') {
  const logger = getLogger(source);
  const { measureAsync } = usePerformanceLogger(source);

  const logFetch = useCallback(function <T>(
    url: string,
    options?: RequestInit,
    customConfig?: {
      name?: string;
      includeResponse?: boolean;
      sensitiveKeys?: string[];
    }
  ): Promise<T> {
    const requestName = customConfig?.name || `${options?.method || 'GET'} ${url}`;

    // Sanitize sensitive information in headers if needed
    const sanitizedOptions = { ...options };
    if (sanitizedOptions.headers && customConfig?.sensitiveKeys) {
      const sanitizedHeaders = { ...sanitizedOptions.headers } as Record<string, string>;
      for (const key of customConfig.sensitiveKeys) {
        if (key in sanitizedHeaders) {
          sanitizedHeaders[key] = '[REDACTED]';
        }
      }
      sanitizedOptions.headers = sanitizedHeaders;
    }

    logger.info(`Request: ${requestName}`, {
      category: LogCategory.NETWORK,
      details: {
        url,
        method: options?.method || 'GET',
        headers: sanitizedOptions.headers
      }
    });

    return measureAsync(requestName, async () => {
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
            details: toLogDetails({
              url,
              method: options?.method || 'GET',
              status: response.status,
              error
            })
          });

          throw error;
        }

        logger.info(`Response: ${requestName}`, {
          category: LogCategory.NETWORK,
          details: customConfig?.includeResponse
            ? { url, status: response.status, data: responseData }
            : { url, status: response.status }
        });

        return responseData;
      } catch (error) {
        if (!(error as any).status) {
          logger.error(`Network error: ${requestName}`, {
            category: LogCategory.NETWORK,
            details: toLogDetails({
              url,
              method: options?.method || 'GET',
              error
            })
          });
        }
        throw error;
      }
    });
  }, [logger, measureAsync]);

  return { logFetch };
}
