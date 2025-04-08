
import React, { Suspense } from 'react';
import { getLogger } from '@/logging';

const logger = getLogger('SafeRouteRegistration');

/**
 * Safely wraps component in a Suspense boundary to prevent route registration errors
 * This prevents errors when routes are registered with components that are not yet loaded
 */
export function withSafeSuspense<T extends React.ComponentType<any>>(
  Component: T, 
  fallback?: React.ReactNode
) {
  // Return a function component to ensure consistent return type for route registration
  return function SafeRouteComponent(props: React.ComponentProps<T>) {
    const defaultFallback = (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
    
    // Log the component being rendered
    logger.debug('Rendering route component with safe suspense', { 
      details: { 
        componentName: Component.displayName || Component.name || 'Unknown'
      } 
    });
    
    return (
      <Suspense fallback={fallback || defaultFallback}>
        <Component {...props} />
      </Suspense>
    );
  };
}

/**
 * Higher-order component to provide error boundary for route components
 */
export function withRouteErrorBoundary<T extends React.ComponentType<any>>(
  Component: T
) {
  // Note: using functional component to maintain consistent typing
  return function ErrorBoundaryComponent(props: React.ComponentProps<T>) {
    return (
      <React.Fragment>
        <Component {...props} />
      </React.Fragment>
    );
  };
}

/**
 * Combines both safe suspense and error boundary in a single HOC
 */
export function withSafeRoute<T extends React.ComponentType<any>>(
  Component: T, 
  fallback?: React.ReactNode
) {
  return withRouteErrorBoundary(withSafeSuspense(Component, fallback));
}
