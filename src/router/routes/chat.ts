
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './site';
import React from 'react';

// Lazy load the chat components
const ChatLayout = React.lazy(() => import('@/chat/components/layouts/ChatLayout'));
const ChatHome = React.lazy(() => import('@/chat/pages/ChatHome'));
const ChatSession = React.lazy(() => import('@/chat/pages/ChatSession'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Chat base route
const chatBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'chat',
  component: () => <React.Suspense fallback={<PageLoader />}><ChatLayout /></React.Suspense>
});

// Chat home route
const chatHomeRoute = createRoute({
  getParentRoute: () => chatBaseRoute,
  path: '/',
  component: () => <React.Suspense fallback={<PageLoader />}><ChatHome /></React.Suspense>
});

// Chat session route
const chatSessionRoute = createRoute({
  getParentRoute: () => chatBaseRoute,
  path: '/session/$sessionId',
  component: ({ params }) => (
    <React.Suspense fallback={<PageLoader />}>
      <ChatSession sessionId={params.sessionId} />
    </React.Suspense>
  )
});

// Export all chat routes
export const chatRoutes = [
  chatBaseRoute.addChildren([
    chatHomeRoute,
    chatSessionRoute
  ])
];
