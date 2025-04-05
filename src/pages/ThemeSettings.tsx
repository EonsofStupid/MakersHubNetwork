
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

export default function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [effectDensity, setEffectDensity] = useState(5);
  const [enableEffects, setEnableEffects] = useState(true);
  const logger = useLogger('ThemeSettings', { category: LogCategory.UI });
  
  useEffect(() => {
    logger.info('Theme settings page mounted', {
      details: {
        initialTheme: theme,
        effectsEnabled: enableEffects,
        animationSpeed,
        effectDensity
      }
    });
  }, [logger, theme, enableEffects, animationSpeed, effectDensity]);

  const handleThemeChange = (selectedTheme: string) => {
    logger.debug('Changing theme', { details: { from: theme, to: selectedTheme } });
    setTheme(selectedTheme);
  };

  const handleToggleEffects = (enabled: boolean) => {
    logger.debug('Toggle effects', { details: { enabled } });
    setEnableEffects(enabled);
    // In a real app, this would update some context or store
  };

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Theme Settings</h1>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="effects">Visual Effects</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Theme</CardTitle>
              <CardDescription>Choose your preferred color theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme-select">Theme</Label>
                <Select 
                  value={theme || 'dark'} 
                  onValueChange={handleThemeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-select">Font Style</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="futuristic">Futuristic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accent Colors</CardTitle>
              <CardDescription>Customize accent colors for the interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {['#00F0FF', '#FF2D6E', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'].map((color) => (
                    <Button 
                      key={color}
                      variant="outline"
                      className="w-full h-10 rounded-md p-0"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        logger.debug('Primary color selected', { details: { color } });
                        // In a real app, this would update some context or store
                      }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="effects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Effects</CardTitle>
              <CardDescription>Customize the appearance of visual effects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-effects">Enable Visual Effects</Label>
                <Switch 
                  id="enable-effects" 
                  checked={enableEffects} 
                  onCheckedChange={handleToggleEffects}
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="animation-speed">Animation Speed</Label>
                    <span className="text-sm text-muted-foreground">{animationSpeed}x</span>
                  </div>
                  <Slider
                    id="animation-speed"
                    disabled={!enableEffects}
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[animationSpeed]}
                    onValueChange={([value]) => {
                      setAnimationSpeed(value);
                      logger.debug('Animation speed changed', { details: { speed: value } });
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="effect-density">Effect Density</Label>
                    <span className="text-sm text-muted-foreground">{effectDensity}</span>
                  </div>
                  <Slider
                    id="effect-density"
                    disabled={!enableEffects}
                    min={1}
                    max={10}
                    step={1}
                    value={[effectDensity]}
                    onValueChange={([value]) => {
                      setEffectDensity(value);
                      logger.debug('Effect density changed', { details: { density: value } });
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Settings</CardTitle>
              <CardDescription>Optimize the application performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="reduce-animations">Reduce Animations</Label>
                <Switch id="reduce-animations" />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="disable-transitions">Disable Transitions</Label>
                <Switch id="disable-transitions" />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="optimize-rendering">Optimize Rendering</Label>
                <Switch id="optimize-rendering" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
