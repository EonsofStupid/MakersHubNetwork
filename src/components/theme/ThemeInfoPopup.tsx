
import React from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Theme } from '@/types/theme';

interface ThemeInfoPopupProps {
  triggerComponent?: React.ReactNode;
}

export function ThemeInfoPopup({ triggerComponent }: ThemeInfoPopupProps) {
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
    <Popover>
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
          
          <div className="mt-4 pt-4 border-t">
            <h5 className="text-xs font-medium mb-2">Color Preview</h5>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 bg-primary rounded-md" title="Primary"></div>
              <div className="h-8 bg-secondary rounded-md" title="Secondary"></div>
              <div className="h-8 bg-accent rounded-md" title="Accent"></div>
              <div className="h-8 bg-background rounded-md border" title="Background"></div>
              <div className="h-8 bg-foreground rounded-md" title="Foreground"></div>
              <div className="h-8 bg-muted rounded-md" title="Muted"></div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeInfoPopup;
