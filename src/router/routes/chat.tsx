
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './site';
import React from 'react';
import { z } from 'zod';

// Zod schema for chat route params
export const chatParamsSchema = {
  sessionId: z.string()
};

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Safe wrapper for lazy-loaded components
const safeComponent = <T extends React.ComponentType<any>>(LazyComp: React.LazyExoticComponent<T>) => {
  return function SafeComponent() {
    return (
      <React.Suspense fallback={<PageLoader />}>
        <LazyComp />
      </React.Suspense>
    );
  };
};

// Safe wrapper for components with params
const safeComponentWithParams = <P extends object>(Component: React.ComponentType<P>) => {
  return function SafeComponentWithParams(props: P) {
    return (
      <React.Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </React.Suspense>
    );
  };
};

// Lazy load the chat components
const ChatLayout = React.lazy(() => import('@/chat/components/layouts/ChatLayout'));
const ChatHome = React.lazy(() => import('@/chat/pages/ChatHome'));
const ChatSession = React.lazy(() => import('@/chat/pages/ChatSession'));

// Chat base route
const chatBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: safeComponent(ChatLayout)
});

// Chat home route
const chatHomeRoute = createRoute({
  getParentRoute: () => chatBaseRoute,
  path: '/',
  component: safeComponent(ChatHome)
});

// Chat session route with Zod parameter validation
const chatSessionRoute = createRoute({
  getParentRoute: () => chatBaseRoute,
  path: '/session/$sessionId',
  parseParams: (params) => ({ 
    sessionId: chatParamsSchema.sessionId.parse(params.sessionId) 
  }),
  component: ({ params }) => {
    return (
      <React.Suspense fallback={<PageLoader />}>
        <ChatSession sessionId={params.sessionId} />
      </React.Suspense>
    );
  }
});

// Create a complete chat route tree
const chatRouteTree = chatBaseRoute.addChildren([
  chatHomeRoute,
  chatSessionRoute
]);

// Export individual routes and the complete tree
export const chatRoutes = {
  base: chatBaseRoute,
  tree: chatRouteTree,
  home: chatHomeRoute,
  session: chatSessionRoute
};
