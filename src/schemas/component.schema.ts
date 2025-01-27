import { z } from "zod";

// Specifications schema for components
const specificationSchema = z.object({
  dimensions: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    depth: z.number().optional(),
    unit: z.enum(["mm", "cm", "in"]).default("mm"),
  }).optional(),
  weight: z.object({
    value: z.number(),
    unit: z.enum(["g", "kg", "lb", "oz"]).default("g"),
  }).optional(),
  material: z.string().optional(),
  compatibility: z.array(z.string()).default([]),
  technical_specs: z.record(z.string(), z.unknown()).optional(),
  mounting: z.object({
    type: z.string(),
    requirements: z.array(z.string()).default([]),
  }).optional(),
}).optional();

export const componentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  category: z.string(),
  description: z.string().optional(),
  specifications: specificationSchema,
  price: z.number().min(0).optional(),
  trending: z.boolean().default(false),
  value_rating: z.number().min(0).max(5).optional(),
  image_url: z.string().url().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Component = z.infer<typeof componentSchema>;

// Schema for creating/updating components
export const componentCreateSchema = componentSchema.omit({ 
  id: true,
  created_at: true,
  updated_at: true,
});

export const componentUpdateSchema = componentCreateSchema.partial();

export type ComponentCreate = z.infer<typeof componentCreateSchema>;
export type ComponentUpdate = z.infer<typeof componentUpdateSchema>;