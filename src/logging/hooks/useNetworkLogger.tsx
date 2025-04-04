
// Fix the call with 3 arguments where 2 are expected

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
    
    // Fix: Remove the third parameter from logger.debug call
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
    
    // Fix: use response.status to determine log level and remove third parameter
    const level = response.status >= 400 ? LogLevel.WARN : LogLevel.DEBUG;
    const message = `API Response: ${status} ${statusText} for ${method?.toUpperCase() || 'GET'} ${url}`;
    
    logger.log(level, message, { details: logData });
    
    return response;
  },
  [logger]
);
