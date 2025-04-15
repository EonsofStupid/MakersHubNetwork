
import { z } from 'zod';

// Define log category enum with all needed values
export const LogCategoryEnum = z.enum([
  'APP', 'ADMIN', 'AUTH', 'API', 'UI', 'PERFORMANCE', 
  'ERROR', 'SECURITY', 'THEME', 'RBAC', 'SYSTEM', 'GRAIN'
]);
export type LogCategory = z.infer<typeof LogCategoryEnum>;

// Define theme effect enum with all needed values
export const ThemeEffectEnum = z.enum([
  'NONE', 'CYBER', 'NEON', 'ELECTRIC', 'GLITCH', 
  'SYNTHWAVE', 'HOLOGRAM', 'BLUR', 'MORPH', 'NOISE', 
  'GRADIENT', 'PULSE', 'PARTICLE', 'GRAIN'
]);
export type ThemeEffect = z.infer<typeof ThemeEffectEnum>;

export const LoadingSkeletonSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['card', 'text', 'list', 'avatar', 'button']),
  count: z.number().min(1).max(10),
  height: z.number().optional(),
  width: z.number().optional()
});

export type LoadingSkeleton = z.infer<typeof LoadingSkeletonSchema>;

// Layout schemas for database validation
export const LayoutComponentSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  props: z.record(z.unknown()).default({}),
  children: z.array(z.lazy(() => LayoutComponentSchema)).optional()
});

export const LayoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  scope: z.string(),
  description: z.string().optional(),
  layout_json: z.object({
    components: z.record(LayoutComponentSchema),
    layout: z.array(z.object({
      id: z.string(),
      parentId: z.string().optional(),
      position: z.number(),
      componentId: z.string()
    }))
  }),
  is_locked: z.boolean().default(false),
  version: z.number().default(1),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  created_by: z.string().uuid().optional()
});

export type Layout = z.infer<typeof LayoutSchema>;
export type LayoutComponent = z.infer<typeof LayoutComponentSchema>;
