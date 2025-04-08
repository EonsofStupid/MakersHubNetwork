
import React from 'react';
import { z } from 'zod';

// Zod schema for chat route params
export const chatParamsSchema = {
  sessionId: z.string()
};

// These routes are now kept for reference but not actively used in the main routing system
// We've migrated to React Router DOM instead

// Export the schema for use in components
export const chatRoutes = {
  basePath: '/chat',
  homePath: '/chat',
  sessionPath: (sessionId: string) => `/chat/session/${sessionId}`
};
