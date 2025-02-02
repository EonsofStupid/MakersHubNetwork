import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ColorPickerProps {
  label: string;
  value: string;
  cssVar?: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  value, 
  cssVar,
  onChange,
  className 
}) => {
  const handleColorChange = (newColor: string) => {
    onChange(newColor);
    // Update CSS variable in real-time
    if (cssVar) {
      document.documentElement.style.setProperty(cssVar, newColor);
    }
    // Show visual feedback
    toast.success(`${label} updated to ${newColor}`, {
      description: `CSS Variable: ${cssVar || 'none'}`,
    });
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm text-gray-300">
          {label}
          {cssVar && (
            <span className="ml-2 text-xs text-gray-400">
              ({cssVar})
            </span>
          )}
        </Label>
        <span className="text-xs font-mono text-gray-400">
          {value}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="text"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            className="mt-1 bg-gray-700/50 border-gray-600 font-mono"
          />
        </div>
        <Input
          type="color"
          value={value}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-12 h-12 p-1 rounded-lg cursor-pointer bg-gray-700/50 border-gray-600 transition-all hover:scale-110"
        />
      </div>
      <div 
        className="h-6 w-full rounded transition-all"
        style={{ 
          background: value,
          boxShadow: `0 0 10px ${value}` 
        }}
      />
    </div>
  );
};