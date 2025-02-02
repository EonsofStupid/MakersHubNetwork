import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormData } from "../types";

interface CSSEffectsControlProps {
  label: string;
  type: "slider" | "select" | "input";
  value: number | string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: any) => void;
  className?: string;
  previewClass?: string;
  description?: string;
  form?: UseFormReturn<SettingsFormData>;
  name?: keyof SettingsFormData;
}

export const CSSEffectsControl: React.FC<CSSEffectsControlProps> = ({
  label,
  type,
  value,
  options,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  previewClass,
  description,
  form,
  name
}) => {
  const handleInputChange = (newValue: number | string) => {
    if (form && name) {
      form.setValue(name, newValue.toString());
    } else {
      onChange(newValue);
    }
  };

  const renderControl = () => {
    switch (type) {
      case "slider":
        return (
          <div className="flex items-center gap-4">
            <Slider
              value={[typeof value === 'number' ? value : 0]}
              min={min}
              max={max}
              step={step}
              onValueChange={(values) => handleInputChange(values[0])}
              className="flex-1"
            />
            <Input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(Number(e.target.value))}
              className="w-20 bg-gray-700/50 border-gray-600 text-white"
              min={min}
              max={max}
              step={step}
            />
          </div>
        );
      case "select":
        return (
          <Select 
            value={value.toString()} 
            onValueChange={handleInputChange}
          >
            <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "input":
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full bg-gray-700/50 border-gray-600 text-white"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <Label className="text-sm text-gray-300">{label}</Label>
        {previewClass && (
          <div className={cn("text-sm px-2 py-1 rounded bg-gray-800/50", previewClass)}>
            Preview
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-400">{description}</p>
      )}
      {renderControl()}
    </div>
  );
};