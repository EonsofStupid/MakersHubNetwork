
import { z } from 'zod';

// Define schemas for common search parameters
export const fromSchema = z.string().optional();
export const pageSchema = z.coerce.number().int().positive().optional().default(1);
export const limitSchema = z.coerce.number().int().positive().optional().default(10);
export const returnToSchema = z.string().optional();

// Common search params structure
export const commonSearchParamsSchema = z.object({
  from: fromSchema,
  returnTo: returnToSchema,
  page: pageSchema,
  limit: limitSchema
});

export type CommonSearchParams = z.infer<typeof commonSearchParamsSchema>;

/**
 * Creates type-safe search parameters object
 */
export function createSearchParams(params: Record<string, string | number | boolean | undefined | null>): Record<string, string> {
  const result: Record<string, string> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      result[key] = String(value);
    }
  });
  
  return result;
}

/**
 * Validates search parameters against a schema
 */
export function validateSearchParams<T extends z.ZodType>(
  params: Record<string, string>, 
  schema: T
): z.infer<T> {
  return schema.parse(params);
}
