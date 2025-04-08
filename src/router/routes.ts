
import { z } from 'zod';

// Define route paths as constants for type safety
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin/*',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_SETTINGS: '/admin/settings',
  CHAT: '/chat', //
  CHAT_DEV: '/chat/dev' //
};

// Define Zod schemas for route parameters and search params
export const loginSearchSchema = z.object({
  returnTo: z.string().optional(),
  from: z.string().optional()
});

export const profileSearchSchema = z.object({
  section: z.enum(['general', 'security', 'preferences']).optional()
});

export const adminSearchSchema = z.object({
  view: z.string().optional()
});

// Export types for use in components
export type LoginSearchParams = z.infer<typeof loginSearchSchema>;
export type ProfileSearchParams = z.infer<typeof profileSearchSchema>;
export type AdminSearchParams = z.infer<typeof adminSearchSchema>;
