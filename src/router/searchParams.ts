
import { z } from 'zod';

// Define standard search param schemas that can be used across the app
export const searchParamsSchema = z.object({
  returnTo: z.string().optional(),
  from: z.string().optional(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

// Type-safe navigation helper for TanStack Router
export function createSearchParams(params: Partial<SearchParams>): Record<string, string> {
  // Filter out undefined values and validate against schema
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined)
  );
  
  // Parse with schema to validate (will throw if invalid)
  const validParams = searchParamsSchema.parse(filteredParams);
  return validParams as Record<string, string>;
}
