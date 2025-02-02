import { z } from "zod";
import type { ComponentType } from "@/types/components";

export const baseComponentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  manufacturer: z.string().min(2, "Manufacturer must be at least 2 characters"),
  cost_usd: z.string().refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  image_url: z.string().optional(),
});

export const getComponentSchema = (type: ComponentType) => {
  switch (type) {
    case "bearings":
      return baseComponentSchema.extend({
        bearing_type: z.string().min(2, "Bearing type must be at least 2 characters"),
      });
    case "extruders":
      return baseComponentSchema.extend({
        extruder_type: z.string().min(2, "Extruder type must be at least 2 characters"),
      });
    case "addons":
      return baseComponentSchema.extend({
        addon_type: z.string().min(2, "Addon type must be at least 2 characters"),
      });
    default:
      return baseComponentSchema;
  }
};