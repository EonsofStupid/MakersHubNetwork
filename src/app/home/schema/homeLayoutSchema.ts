
import { z } from 'zod';

// Define valid section types
export const SectionTypeEnum = z.enum([
  'hero',
  'featured',
  'posts',
  'categories',
  'db'
]);

export type SectionType = z.infer<typeof SectionTypeEnum>;

// Schema for home layout configuration from backend
export const HomeLayoutSchema = z.object({
  id: z.string().uuid(),
  section_order: z.array(SectionTypeEnum).default(['hero', 'featured', 'categories', 'posts', 'db']),
  featured_override: z.string().uuid().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional()
});

export type HomeLayout = z.infer<typeof HomeLayoutSchema>;

// Fallback layout (used when backend is unavailable)
export const FallbackLayout: HomeLayout = {
  id: '00000000-0000-0000-0000-000000000000',
  section_order: ['hero', 'featured', 'categories', 'posts'],
  featured_override: null,
  updated_at: new Date().toISOString()
};
