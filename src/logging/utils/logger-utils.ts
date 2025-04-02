
import { getLogger } from '../logger.service';
import { LogCategory } from '../types';
import { measureExecution as measurePerformance } from '@/shared/utils/performance';

/**
 * Creates a performance measurement utility
 * 
 * @param source The source/component making the measurement
 * @param category The log category
 * @returns A measurement utility
 */
export function createMeasurement(source: string, category: LogCategory = LogCategory.PERFORMANCE) {
  const logger = getLogger(source);
  const measurements = new Map<string, number>();
  
  return {
    /**
     * Start measuring a named operation
     * @param name Name of the operation to measure
     */
    start: (name: string): void => {
      measurements.set(name, performance.now());
    },
    
    /**
     * End measuring a named operation and log the results
     * @param name Name of the operation that was measured
     * @param description Optional description of what was measured
     * @param tags Optional tags to categorize the measurement
     */
    end: (name: string, description?: string, tags?: string[]): number => {
      const startTime = measurements.get(name);
      
      if (!startTime) {
        logger.warn(`Measurement "${name}" was never started`, {
          category,
          details: { name }
        });
        return 0;
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Remove from measurements map
      measurements.delete(name);
      
      // Log the performance measurement
      const message = description || `Completed ${name}`;
      logger.performance(message, duration, {
        category,
        details: { name, duration },
        tags: tags || ['performance', name]
      });
      
      return duration;
    },
    
    /**
     * Measure an operation's execution time
     * @param name Name of the operation
     * @param operation Function to measure
     * @param description Optional description of what was measured
     * @param tags Optional tags to categorize the measurement
     * @returns The result of the operation
     */
    measure: async <T>(
      name: string,
      operation: () => T | Promise<T>,
      description?: string,
      tags?: string[]
    ): Promise<T> => {
      measurements.set(name, performance.now());
      
      try {
        const result = await operation();
        const endTime = performance.now();
        const duration = endTime - measurements.get(name)!;
        
        // Remove from measurements map
        measurements.delete(name);
        
        // Log the performance measurement
        const message = description || `Completed ${name}`;
        logger.performance(message, duration, {
          category,
          details: { name, duration },
          tags: tags || ['performance', name]
        });
        
        return result;
      } catch (error) {
        // If operation fails, still record duration
        const endTime = performance.now();
        const duration = endTime - measurements.get(name)!;
        
        // Remove from measurements map
        measurements.delete(name);
        
        // Log the failed operation
        logger.performance(`Failed ${name}`, duration, {
          category,
          details: { name, duration, error },
          tags: tags ? [...tags, 'error'] : ['performance', name, 'error']
        });
        
        throw error;
      }
    },
    
    /**
     * Create a decorator that can be used to measure any function
     * @param name Base name for the measurement
     * @param description Description template for the measurement
     * @returns A decorator function
     */
    createDecorator: (name: string, description?: string) => {
      return function<T extends (...args: any[]) => any>(
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<T>
      ): TypedPropertyDescriptor<T> {
        const originalMethod = descriptor.value!;
        
        descriptor.value = function(...args: any[]) {
          const measurementName = `${name}.${propertyKey}`;
          measurements.set(measurementName, performance.now());
          
          try {
            const result = originalMethod.apply(this, args);
            
            // Handle promises
            if (result instanceof Promise) {
              return result.then(
                (value) => {
                  const endTime = performance.now();
                  const duration = endTime - measurements.get(measurementName)!;
                  measurements.delete(measurementName);
                  
                  const desc = description || `Completed ${measurementName}`;
                  logger.performance(desc, duration, {
                    category,
                    details: { name: measurementName, duration },
                    tags: ['performance', name, propertyKey]
                  });
                  
                  return value;
                },
                (error) => {
                  const endTime = performance.now();
                  const duration = endTime - measurements.get(measurementName)!;
                  measurements.delete(measurementName);
                  
                  logger.performance(`Failed ${measurementName}`, duration, {
                    category,
                    details: { name: measurementName, duration, error },
                    tags: ['performance', name, propertyKey, 'error']
                  });
                  
                  throw error;
                }
              );
            }
            
            // Handle synchronous functions
            const endTime = performance.now();
            const duration = endTime - measurements.get(measurementName)!;
            measurements.delete(measurementName);
            
            const desc = description || `Completed ${measurementName}`;
            logger.performance(desc, duration, {
              category,
              details: { name: measurementName, duration },
              tags: ['performance', name, propertyKey]
            });
            
            return result;
          } catch (error) {
            const endTime = performance.now();
            const duration = endTime - measurements.get(measurementName)!;
            measurements.delete(measurementName);
            
            logger.performance(`Failed ${measurementName}`, duration, {
              category,
              details: { name: measurementName, duration, error },
              tags: ['performance', name, propertyKey, 'error']
            });
            
            throw error;
          }
        } as any;
        
        return descriptor;
      };
    }
  };
}

/**
 * Measures the execution time of a function and returns the result
 * 
 * @param fn The function to measure
 * @param source The source/component making the measurement
 * @param name Name of the measurement
 * @param category The log category
 * @returns The result of the function
 */
export async function measureExecution<T>(
  fn: () => T | Promise<T>,
  source: string,
  name: string,
  category: LogCategory = LogCategory.PERFORMANCE
): Promise<T> {
  const measurement = createMeasurement(source, category);
  return measurement.measure(name, fn);
}

/**
 * Creates a higher-order component that measures render time
 * 
 * @param Component Component to measure
 * @param name Name for the measurement
 * @returns Wrapped component with performance measurement
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  name: string
): React.FC<P> {
  const displayName = Component.displayName || Component.name || name;
  
  const WrappedComponent: React.FC<P> = (props) => {
    const logger = getLogger(displayName);
    const renderStart = performance.now();
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const renderTime = performance.now() - renderStart;
      logger.performance(`Render time for ${displayName}`, renderTime, {
        category: LogCategory.PERFORMANCE,
        details: { component: displayName }
      });
    });
    
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `WithPerformanceTracking(${displayName})`;
  return WrappedComponent;
}

/**
 * Creates a hook for measuring user interaction timing
 * 
 * @param source The source/component making the measurement
 * @returns Hook for measuring interaction timing
 */
export function useInteractionTiming(source: string) {
  const logger = getLogger(source);
  
  return {
    measureInteraction: <T>(
      name: string,
      fn: (...args: any[]) => T,
      category: LogCategory = LogCategory.UI
    ) => {
      return (...args: any[]): T => {
        const start = performance.now();
        try {
          const result = fn(...args);
          const duration = performance.now() - start;
          
          logger.performance(`Interaction: ${name}`, duration, {
            category,
            details: { interaction: name, args }
          });
          
          return result;
        } catch (error) {
          const duration = performance.now() - start;
          
          logger.error(`Interaction failed: ${name}`, {
            category,
            details: { interaction: name, duration, error, args }
          });
          
          throw error;
        }
      };
    }
  };
}
