
import React, { Suspense, useEffect, useRef } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import CircuitBreaker from '@/utils/CircuitBreaker';
import { getLogger } from '@/logging';

// Lazy load the actual FloatingChat component
const FloatingChat = React.lazy(() => 
  import('./FloatingChat').then(module => ({ default: module.FloatingChat }))
);

function FloatingChatWrapper() {
  const logger = getLogger('FloatingChatWrapper');
  const mountedRef = useRef(false);
  
  // Use a circuit breaker to prevent excessive renders
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    
    // Initialize circuit breaker for this component
    CircuitBreaker.init('floating-chat', 5, 1000);
    
    return () => {
      // Reset the circuit breaker on unmount
      CircuitBreaker.reset('floating-chat');
    };
  }, []);
  
  // Use circuit breaker to detect potential render loops
  if (CircuitBreaker.count('floating-chat')) {
    logger.warn('CircuitBreaker detected potential infinite loop in FloatingChatWrapper');
    return null;
  }
  
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <FloatingChat />
      </Suspense>
    </ErrorBoundary>
  );
}

export default FloatingChatWrapper;
