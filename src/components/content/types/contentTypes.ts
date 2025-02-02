import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

// Base content type schema that all content types extend
export const baseContentTypeSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  version: z.number().optional(),
});

// Page content type
export const pageContentSchema = baseContentTypeSchema.extend({
  type: z.literal("page"),
  content: z.object({
    body: z.string(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    }).optional(),
  }),
});

// Component content type
export const componentContentSchema = baseContentTypeSchema.extend({
  type: z.literal("component"),
  content: z.object({
    componentType: z.string(),
    props: z.record(z.any()),
    styles: z.record(z.string()).optional(),
  }),
});

// Type definitions
export type BaseContent = z.infer<typeof baseContentTypeSchema>;
export type PageContent = z.infer<typeof pageContentSchema>;
export type ComponentContent = z.infer<typeof componentContentSchema>;

export type ContentType = "page" | "component" | "template" | "workflow";
export type ContentTypeSchema = 
  | typeof pageContentSchema 
  | typeof componentContentSchema;

// Helper function to get schema by content type
export const getSchemaByType = (type: ContentType): ContentTypeSchema => {
  switch (type) {
    case "page":
      return pageContentSchema;
    case "component":
      return componentContentSchema;
    default:
      throw new Error(`Schema not implemented for type: ${type}`);
  }
};