import { z } from "zod";

// Basic schemas for nested objects
const socialLinksSchema = z.object({
  github: z.string().url().optional(),
  twitter: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  website: z.string().url().optional(),
}).optional();

const layoutPreferenceSchema = z.object({
  contentWidth: z.enum(["default", "wide", "full"]).default("full"),
  sidebarPosition: z.enum(["left", "right"]).default("left"),
}).default({
  contentWidth: "full",
  sidebarPosition: "left",
});

const customStylesSchema = z.record(z.string(), z.unknown()).default({});

// Main profile schema
export const profileSchema = z.object({
  id: z.string().uuid(),
  display_name: z.string().min(2).max(50).optional(),
  avatar_url: z.string().url().optional(),
  preferences: z.record(z.string(), z.unknown()).default({}),
  theme_preference: z.string().default("cyberpunk"),
  motion_enabled: z.boolean().default(true),
  layout_preference: layoutPreferenceSchema,
  social_links: socialLinksSchema.default({}),
  bio: z.string().max(500).optional(),
  custom_styles: customStylesSchema,
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Profile = z.infer<typeof profileSchema>;

// Partial schema for updates
export const profileUpdateSchema = profileSchema.partial().omit({ 
  id: true,
  created_at: true,
  updated_at: true,
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;