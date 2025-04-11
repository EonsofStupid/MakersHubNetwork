
import React from 'react';
import { TextWithPopup } from './TextWithPopup';
import { useThemeStore } from '@/stores/theme/store';

export function ThemeInfoTab() {
  const { currentTheme } = useThemeStore();
  
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <h3 className="text-lg font-medium">Theme Details</h3>
        <p className="text-sm text-muted-foreground">
          Information about the current theme configuration
        </p>
      </div>
      
      <div className="grid gap-2 rounded-lg border p-4">
        <TextWithPopup label="Name" text={currentTheme?.name || 'Default'} />
        <TextWithPopup label="ID" text={currentTheme?.id || 'default'} />
        <TextWithPopup label="Mode" text="Dark" />
      </div>
      
      <div className="grid gap-2">
        <h3 className="text-lg font-medium">Theme Features</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Dynamic color scheme</li>
          <li>Custom UI components</li>
          <li>Animation effects</li>
          <li>Responsive design</li>
          <li>Dark mode support</li>
        </ul>
      </div>
    </div>
  );
}
