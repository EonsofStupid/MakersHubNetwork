
import React from "react";
import { Card } from "@/components/ui/card";
import { ThemeVisualEditor } from "@/admin/components/theme/ThemeVisualEditor";
import { Palette } from "lucide-react";

export default function VisualThemeEditorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Visual Theme Editor</h1>
      </div>
      
      <p className="text-muted-foreground">
        Customize the appearance of the platform using the visual theme editor.
        Changes will be reflected in real-time.
      </p>
      
      <ThemeVisualEditor />
    </div>
  );
}
