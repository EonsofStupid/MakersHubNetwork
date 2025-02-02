import { z } from "zod";
import { Json } from "@/integrations/supabase/types";
import type { ContentType } from "./contentTypes";

export type ContentStatus = "draft" | "published" | "archived";

export interface BaseContent {
  id: string;
  type: ContentType;
  title: string;
  content: Json;
  metadata?: Json;
  status: ContentStatus;
  version?: number;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentRelationship {
  id: string;
  parent_id: string;
  child_id: string;
  relationship_type: string;
  order_index: number;
}

export const contentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["page", "component", "template", "workflow"]),
  slug: z.string().optional(),
  content: z.record(z.any()),
  metadata: z.record(z.any()).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export type ContentFormData = z.infer<typeof contentSchema>;