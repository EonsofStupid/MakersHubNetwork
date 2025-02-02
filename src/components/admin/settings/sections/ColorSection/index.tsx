import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormData } from "../../types";
import { ColorPicker } from "../../components/ColorPicker";

interface ColorSectionProps {
  form: UseFormReturn<SettingsFormData>;
}

export const ColorSection: React.FC<ColorSectionProps> = ({ form }) => {
  return (
    <AccordionItem value="colors">
      <AccordionTrigger className="text-lg font-semibold text-white">
        Colors & Theme
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="grid gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Brand Colors</h3>
            <ColorPicker
              label="Primary Color"
              cssVar="--primary"
              value={form.watch("primary_color")}
              onChange={(color) => form.setValue("primary_color", color)}
            />
            <ColorPicker
              label="Secondary Color"
              cssVar="--secondary"
              value={form.watch("secondary_color")}
              onChange={(color) => form.setValue("secondary_color", color)}
            />
            <ColorPicker
              label="Accent Color"
              cssVar="--accent"
              value={form.watch("accent_color")}
              onChange={(color) => form.setValue("accent_color", color)}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Text Colors</h3>
            <ColorPicker
              label="Primary Text"
              cssVar="--text-primary"
              value={form.watch("text_primary_color")}
              onChange={(color) => form.setValue("text_primary_color", color)}
            />
            <ColorPicker
              label="Secondary Text"
              cssVar="--text-secondary"
              value={form.watch("text_secondary_color")}
              onChange={(color) => form.setValue("text_secondary_color", color)}
            />
            <ColorPicker
              label="Link Text"
              cssVar="--text-link"
              value={form.watch("text_link_color")}
              onChange={(color) => form.setValue("text_link_color", color)}
            />
            <ColorPicker
              label="Heading Text"
              cssVar="--text-heading"
              value={form.watch("text_heading_color")}
              onChange={(color) => form.setValue("text_heading_color", color)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Neon Effects</h3>
            <ColorPicker
              label="Neon Cyan"
              cssVar="--neon-cyan"
              value={form.watch("neon_cyan")}
              onChange={(color) => form.setValue("neon_cyan", color)}
            />
            <ColorPicker
              label="Neon Pink"
              cssVar="--neon-pink"
              value={form.watch("neon_pink")}
              onChange={(color) => form.setValue("neon_pink", color)}
            />
            <ColorPicker
              label="Neon Purple"
              cssVar="--neon-purple"
              value={form.watch("neon_purple")}
              onChange={(color) => form.setValue("neon_purple", color)}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};