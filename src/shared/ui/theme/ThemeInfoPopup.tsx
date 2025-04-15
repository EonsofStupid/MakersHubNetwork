
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { useThemeStore } from '@/shared/stores/theme/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import ThemeInfoTab from './info/ThemeInfoTab';
import { Theme } from '@/types/theme';

interface ThemeInfoPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme?: Theme | null;
}

export const ThemeInfoPopup: React.FC<ThemeInfoPopupProps> = ({
  open,
  onOpenChange,
  theme
}) => {
  const [activeTab, setActiveTab] = useState('details');
  
  if (!theme) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{theme.name || 'Theme Details'}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <ThemeInfoTab theme={theme} />
          </TabsContent>
          
          <TabsContent value="colors">
            <div className="grid gap-2">
              {theme.designTokens?.colors && 
                Object.entries(theme.designTokens.colors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: value }}
                    />
                    <span className="text-sm">{key}</span>
                  </div>
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="effects">
            <p className="text-sm">Effect information not available</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeInfoPopup;
