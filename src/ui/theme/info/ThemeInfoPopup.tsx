
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/core/dialog';
import { Button } from '@/ui/core/button';
import { ThemeInfoTabs } from './ThemeInfoTabs';
import { useThemeStore } from '@/stores/theme/store';

export function ThemeInfoPopup() {
  const { currentTheme } = useThemeStore();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <InfoIcon className="h-4 w-4" />
          <span className="sr-only">Theme Information</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background/95 backdrop-blur-sm max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Theme Information</DialogTitle>
          <DialogDescription>
            Current theme: {currentTheme?.name || 'Default'}
          </DialogDescription>
        </DialogHeader>
        <ThemeInfoTabs />
      </DialogContent>
    </Dialog>
  );
}
