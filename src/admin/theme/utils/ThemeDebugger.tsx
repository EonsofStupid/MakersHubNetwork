
import React, { useState } from 'react';
import { useAdminTheme } from '../hooks/useAdminTheme';
import { useThemeColors } from '../hooks/useThemeColors';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bug } from 'lucide-react';

export function ThemeDebugger() {
  const [open, setOpen] = useState(false);
  const { componentStyles, impulseTheme } = useAdminTheme();
  const colors = useThemeColors();
  
  // Get CSS variables from document root
  const getCssVariables = () => {
    if (typeof window === 'undefined') return {};
    
    const styles = getComputedStyle(document.documentElement);
    const cssVars: Record<string, string> = {};
    
    // Get all CSS variables starting with specific prefixes
    ['--', '--impulse-', '--color-', '--site-', '--admin-'].forEach(prefix => {
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.startsWith(prefix)) {
          cssVars[prop] = styles.getPropertyValue(prop).trim();
        }
      }
    });
    
    return cssVars;
  };
  
  const cssVariables = getCssVariables();
  
  // Color preview component
  const ColorPreview = ({ color, name }: { color: string; name: string }) => (
    <div className="flex items-center gap-2 mb-2">
      <div 
        className="w-6 h-6 rounded-full border border-white/10" 
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono truncate">{name}</p>
      </div>
      <div className="text-xs font-mono opacity-70">{color}</div>
    </div>
  );
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-1 opacity-70 hover:opacity-100 hover:bg-destructive/20 border-destructive/50"
        >
          <Bug className="h-4 w-4" />
          <span className="text-xs">Theme Debug</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Theme Debugger</DialogTitle>
          <DialogDescription>
            Inspect theme values and CSS variables
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="colors">
          <TabsList className="mb-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="css-vars">CSS Variables</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Primary Colors</h3>
                <div className="space-y-1 p-4 bg-black/20 rounded-md">
                  <ColorPreview color={colors.primary} name="primary" />
                  <ColorPreview color={`rgb(${colors.primaryRgb})`} name="primaryRgb" />
                  <ColorPreview color={`hsl(${colors.primaryHsl})`} name="primaryHsl" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Secondary Colors</h3>
                <div className="space-y-1 p-4 bg-black/20 rounded-md">
                  <ColorPreview color={colors.secondary} name="secondary" />
                  <ColorPreview color={`rgb(${colors.secondaryRgb})`} name="secondaryRgb" />
                  <ColorPreview color={`hsl(${colors.secondaryHsl})`} name="secondaryHsl" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Background Colors</h3>
                <div className="space-y-1 p-4 bg-black/20 rounded-md">
                  <ColorPreview color={colors.background} name="background" />
                  <ColorPreview color={colors.foreground} name="foreground" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Text Colors</h3>
                <div className="space-y-1 p-4 bg-black/20 rounded-md">
                  <ColorPreview color={colors.foreground} name="foreground" />
                  <ColorPreview color={colors.getColor('colors.text.secondary', '#A1A1AA')} name="text.secondary" />
                  <ColorPreview color={colors.getColor('colors.text.muted', '#71717A')} name="text.muted" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="css-vars">
            <div className="space-y-4">
              <div className="max-h-[50vh] overflow-auto p-4 bg-black/20 rounded-md">
                <pre className="text-xs font-mono">
                  {Object.entries(cssVariables).map(([name, value]) => (
                    <div key={name} className="flex items-start mb-1">
                      <span className="text-primary whitespace-nowrap">{name}:</span>
                      <span className="ml-2 text-muted-foreground break-all">{value}</span>
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="components">
            <div className="space-y-4">
              <div className="max-h-[50vh] overflow-auto p-4 bg-black/20 rounded-md">
                <pre className="text-xs font-mono">
                  {Object.keys(componentStyles).length > 0 ? 
                    JSON.stringify(componentStyles, null, 2) : 
                    "No component styles loaded"
                  }
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tokens">
            <div className="space-y-4">
              <div className="max-h-[50vh] overflow-auto p-4 bg-black/20 rounded-md">
                <pre className="text-xs font-mono">
                  {JSON.stringify(impulseTheme, null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
