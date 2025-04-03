
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
    onChange(e.target.value);
  };
  
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal flex items-center gap-2 h-10",
              !color && "text-muted-foreground"
            )}
            style={{ 
              borderColor: currentColor
            }}
          >
            <div
              className="h-5 w-5 rounded-full"
              style={{ backgroundColor: currentColor }}
            />
            <span>{currentColor}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-md"
                style={{ backgroundColor: currentColor }}
              />
              <input
                type="text"
                value={currentColor}
                onChange={(e) => {
                  setCurrentColor(e.target.value);
                  onChange(e.target.value);
                }}
                className="w-full h-8 px-2 text-sm rounded-md border border-border bg-background"
              />
            </div>
            <input
              type="color"
              value={currentColor}
              onChange={handleChange}
              className="w-full h-8 cursor-pointer"
            />
            <div className="grid grid-cols-10 gap-1 mt-2">
              {['#00F0FF', '#FF2D6E', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#FFFFFF', '#94A3B8', '#334155', '#121212'].map((presetColor) => (
                <button
                  key={presetColor}
                  className={cn("w-full h-5 rounded-sm border", 
                    currentColor === presetColor && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    setCurrentColor(presetColor);
                    onChange(presetColor);
                  }}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
