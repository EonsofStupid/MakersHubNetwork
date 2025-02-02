import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ColorPicker } from "./ColorPicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FontColorSettingsSection = ({ form }: { form: any }) => {
  return (
    <AccordionItem value="font-colors">
      <AccordionTrigger className="text-lg font-semibold text-white">
        Font Colors
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text Colors</TabsTrigger>
            <TabsTrigger value="neon">Neon Effects</TabsTrigger>
            <TabsTrigger value="brand">Brand Colors</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4 mt-4">
            <ColorPicker
              label="Primary Text"
              cssVar="--foreground"
              value={form.watch("text_primary_color")}
              onChange={(color) => form.setValue("text_primary_color", color)}
            />
            <ColorPicker
              label="Secondary Text"
              cssVar="--muted-foreground"
              value={form.watch("text_secondary_color")}
              onChange={(color) => form.setValue("text_secondary_color", color)}
            />
            <ColorPicker
              label="Link Text"
              cssVar="--link"
              value={form.watch("text_link_color")}
              onChange={(color) => form.setValue("text_link_color", color)}
            />
            <ColorPicker
              label="Heading Text"
              cssVar="--heading"
              value={form.watch("text_heading_color")}
              onChange={(color) => form.setValue("text_heading_color", color)}
            />
          </TabsContent>

          <TabsContent value="neon" className="space-y-4 mt-4">
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
          </TabsContent>

          <TabsContent value="brand" className="space-y-4 mt-4">
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
          </TabsContent>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
};