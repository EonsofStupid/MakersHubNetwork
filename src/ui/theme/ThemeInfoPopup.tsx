
import React from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { Badge } from '@/ui/core/badge';
import { Button } from '@/ui/core/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/core/popover';
import { Theme } from '@/types/theme';

interface ThemeInfoPopupProps {
  triggerComponent?: React.ReactNode;
  onClose?: () => void;
}

export function ThemeInfoPopup({ triggerComponent, onClose }: ThemeInfoPopupProps) {
  const { currentTheme, isLoading } = useThemeStore();
  
  if (isLoading) {
    return null;
  }
  
  const themeObj = currentTheme as Theme;
  
  const defaultTrigger = (
    <Button variant="outline" size="sm">
      Theme Info
    </Button>
  );
  
  return (
    <Popover onOpenChange={(open) => {
      if (!open && onClose) {
        onClose();
      }
    }}>
      <PopoverTrigger asChild>
        {triggerComponent || defaultTrigger}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Current Theme</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{themeObj?.name || 'Default'}</Badge>
            <Badge variant="secondary">v{themeObj?.version || '1'}</Badge>
            {themeObj?.is_default && <Badge>Default</Badge>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
