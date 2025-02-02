export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

export const executeWithRetry = async <T>(
  operation: () => Promise<T>,
  config: RetryConfig = defaultRetryConfig
): Promise<T> => {
  let attempt = 1;
  
  while (attempt <= config.maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === config.maxAttempts) throw error;
      
      const delay = Math.min(
        config.baseDelay * Math.pow(2, attempt - 1),
        config.maxDelay
      );
      
      console.log(`Retry ${attempt}/${config.maxAttempts} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }
  
  throw new Error('Max retry attempts reached');
};