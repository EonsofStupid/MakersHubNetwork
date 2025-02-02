import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download } from "lucide-react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormData } from "../../types";

interface ThemeImportSectionProps {
  form: UseFormReturn<SettingsFormData>;
}

export const ThemeImportSection: React.FC<ThemeImportSectionProps> = ({ form }) => {
  const handleThemeImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result;
        const theme = JSON.parse(content as string);
        
        // Update form with imported theme values
        Object.entries(theme).forEach(([key, value]) => {
          if (form.getValues(key as keyof SettingsFormData) !== undefined) {
            form.setValue(key as keyof SettingsFormData, value as any);
          }
        });

        toast.success("Theme imported successfully");
      } catch (error) {
        console.error("Theme import error:", error);
        toast.error("Failed to import theme");
      }
    };
    reader.readAsText(file);
  };

  const handleThemeExport = () => {
    try {
      const themeData = form.getValues();
      const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "theme-config.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Theme exported successfully");
    } catch (error) {
      console.error("Theme export error:", error);
      toast.error("Failed to export theme");
    }
  };

  return (
    <AccordionItem value="theme-import">
      <AccordionTrigger className="text-lg font-semibold text-white">
        Theme Import/Export
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <Card className="p-6 bg-gray-800/50 border border-white/10">
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-white">Import Theme</Label>
              <div className="mt-2">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleThemeImport}
                  className="hidden"
                  id="theme-import"
                />
                <label htmlFor="theme-import">
                  <Button
                    variant="outline"
                    className="w-full bg-gray-700/50 border-gray-600 hover:bg-gray-600/50"
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Theme Configuration
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-white">Export Theme</Label>
              <div className="mt-2">
                <Button
                  variant="outline"
                  className="w-full bg-gray-700/50 border-gray-600 hover:bg-gray-600/50"
                  onClick={handleThemeExport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Current Theme
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};