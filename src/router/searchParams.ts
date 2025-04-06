
import { z } from 'zod';

// Common search parameters schema used across the application
export const commonSearchParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  returnTo: z.string().optional(),
  from: z.string().optional(),
});

// Type for the validated search parameters
export type CommonSearchParams = z.infer<typeof commonSearchParamsSchema>;

// Search parameters for auth-related routes
export const authSearchParamsSchema = z.object({
  returnTo: z.string().optional(),
  from: z.string().optional(),
  action: z.enum(['signin', 'signup', 'reset']).optional(),
});

// Type for the validated auth search parameters
export type AuthSearchParams = z.infer<typeof authSearchParamsSchema>;

// Search parameters for theme-related routes
export const themeSearchParamsSchema = z.object({
  id: z.string().optional(),
  context: z.enum(['site', 'admin', 'chat', 'app', 'training']).optional().default('site'),
});

// Type for the validated theme search parameters
export type ThemeSearchParams = z.infer<typeof themeSearchParamsSchema>;
