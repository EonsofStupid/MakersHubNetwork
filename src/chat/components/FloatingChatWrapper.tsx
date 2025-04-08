
import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load the actual FloatingChat component
const FloatingChat = React.lazy(() => 
  import('./FloatingChat').then(module => ({ default: module.FloatingChat }))
);

function FloatingChatWrapper() {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <FloatingChat />
      </Suspense>
    </ErrorBoundary>
  );
}

export default FloatingChatWrapper;
