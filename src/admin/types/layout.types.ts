
import { z } from 'zod';

// Component properties schema
export const ComponentPropsSchema = z.record(z.any());

// Component schema
export const ComponentSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: ComponentPropsSchema.optional(),
  children: z.lazy(() => z.array(ComponentSchema).optional()),
  layout: z.record(z.any()).optional(),
  permissions: z.array(z.string()).optional(),
  meta: z.record(z.any()).optional(),
});

// Layout schema
export const LayoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  scope: z.string(),
  components: z.array(ComponentSchema),
  version: z.number().optional(),
  meta: z.record(z.any()).optional(),
});

// Layout skeleton from database
export const LayoutSkeletonSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  scope: z.string(),
  layout_json: z.record(z.any()),
  version: z.number(),
  is_active: z.boolean(),
  is_locked: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  description: z.string().optional(),
  created_by: z.string().uuid().optional(),
});

// Zod types
export type Component = z.infer<typeof ComponentSchema>;
export type Layout = z.infer<typeof LayoutSchema>;
export type LayoutSkeleton = z.infer<typeof LayoutSkeletonSchema>;

// Additional types
export interface ComponentRegistration {
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
  permissions?: string[];
  meta?: Record<string, any>;
}

export interface LayoutEngineOptions {
  fallbackLayout?: Layout;
  onLayoutError?: (error: Error) => void;
  layoutPermissionCheck?: (permissions: string[]) => boolean;
  layoutCache?: boolean;
  editMode?: boolean;
}
