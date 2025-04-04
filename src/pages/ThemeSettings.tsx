import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Color } from 'react-color';
import { ChromePicker } from 'react-color';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/constants/log-level';
import { safeDetails } from '@/logging/utils/safeDetails';

export default function ThemeSettings() {
  const [formState, setFormState] = useState({
    primaryColor: '#00F0FF',
    secondaryColor: '#FF2D6E',
    backgroundColor: '#12121A',
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const logger = useLogger('ThemeSettings', { category: LogCategory.THEME });
  
  useEffect(() => {
    logger.info('Theme settings page loaded');
  }, [logger]);
  
  const handleColorChange = (color: Color, name: string) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: color.hex,
    }));
  };
  
  const saveTheme = async (themeData: any) => {
    if (!user?.id) {
      toast({
        title: 'Not authenticated',
        description: 'You must be logged in to save theme settings.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      logger.info('Saving theme settings', { details: safeDetails(themeData) });
      
      const { error } = await supabase
        .from('user_themes')
        .upsert([
          {
            user_id: user.id,
            primary_color: themeData.primaryColor,
            secondary_color: themeData.secondaryColor,
            background_color: themeData.backgroundColor,
          },
        ], { onConflict: 'user_id' });
      
      if (error) throw error;
      
      toast({
        title: 'Theme saved',
        description: 'Your theme settings have been saved successfully.',
      });
      
      logger.info('Theme settings saved successfully');
    } catch (err) {
      logger.error('Failed to save theme settings', { details: safeDetails(err) });
      toast({
        title: 'Error saving theme',
        description: 'There was an error saving your theme settings. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleColorPickerSubmit = () => {
    saveTheme(formState);
  };
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <Input
                type="color"
                id="primary-color"
                value={formState.primaryColor}
                onChange={(e) => handleColorChange({ hex: e.target.value } as Color, 'primaryColor')}
              />
              <ChromePicker
                color={formState.primaryColor}
                onChange={(color) => handleColorChange(color, 'primaryColor')}
              />
            </div>
            
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <Input
                type="color"
                id="secondary-color"
                value={formState.secondaryColor}
                onChange={(e) => handleColorChange({ hex: e.target.value } as Color, 'secondaryColor')}
              />
              <ChromePicker
                color={formState.secondaryColor}
                onChange={(color) => handleColorChange(color, 'secondaryColor')}
              />
            </div>
            
            <div>
              <Label htmlFor="background-color">Background Color</Label>
              <Input
                type="color"
                id="background-color"
                value={formState.backgroundColor}
                onChange={(e) => handleColorChange({ hex: e.target.value } as Color, 'backgroundColor')}
              />
              <ChromePicker
                color={formState.backgroundColor}
                onChange={(color) => handleColorChange(color, 'backgroundColor')}
              />
            </div>
          </div>
          
          <Button onClick={handleColorPickerSubmit}>Save Theme</Button>
        </CardContent>
      </Card>
    </div>
  );
}
