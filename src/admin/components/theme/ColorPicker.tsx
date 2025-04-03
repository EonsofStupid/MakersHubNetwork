
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Copy, Check } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`color-${label.toLowerCase()}`} className="text-sm font-medium">
          {label}
        </Label>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <div 
              className="h-8 w-8 rounded-md border cursor-pointer" 
              style={{ backgroundColor: color }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div>
              <div 
                className="mb-2 h-24 rounded-md border"
                style={{ backgroundColor: color }}
              />
              <input
                type="color"
                id={`color-picker-${label.toLowerCase()}`}
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </PopoverContent>
        </Popover>
        <Input
          id={`color-${label.toLowerCase()}`}
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono"
        />
      </div>
    </div>
  );
}
