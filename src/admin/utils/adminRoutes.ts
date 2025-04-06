
import { z } from 'zod';

// Define admin route path schema
export const adminPathSchema = z.enum([
  '/admin',
  '/admin/dashboard',
  '/admin/users',
  '/admin/parts',
  '/admin/builds',
  '/admin/themes',
  '/admin/content',
  '/admin/settings',
  '/admin/permissions',
  '/admin/logs',
  '/admin/unauthorized'
]);

export type AdminPath = z.infer<typeof adminPathSchema>;

// Helper function to validate admin paths
export function validateAdminPath(path: string): string {
  try {
    return adminPathSchema.parse(path);
  } catch (error) {
    // Return a default path if validation fails
    console.error(`Invalid admin path: ${path}`, error);
    return '/admin/dashboard';
  }
}

/**
 * Returns the validated admin path or a fallback path if invalid
 */
export function getAdminPath(path: string, fallback: AdminPath = '/admin/dashboard'): string {
  try {
    return adminPathSchema.parse(path);
  } catch (error) {
    return fallback;
  }
}
