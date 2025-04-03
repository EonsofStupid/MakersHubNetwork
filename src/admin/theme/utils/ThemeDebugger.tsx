
import React, { useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
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
import { ensureHexColor } from './colorUtils';
import { validateThemeSchema, logThemeState } from '@/utils/ThemeValidationUtils';
import { getThemeProperty } from './themeUtils';

export function ThemeDebugger() {
  const [open, setOpen] = useState(false);
  const { currentTheme, componentStyles, impulseTheme } = useAdminTheme();
  
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
  
  // Validate theme structure and log issues
  const validateCurrentTheme = () => {
    const issues = validateThemeSchema(currentTheme || impulseTheme);
    logThemeState();
    return issues.length > 0 ? issues : ['✅ Theme structure is valid'];
  };
  
  // Force a complete theme refresh
  const refreshTheme = () => {
    logThemeState();
    window.location.reload();
  };
  
  // Color preview component
  const ColorPreview = ({ color, name }: { color: string; name: string }) => {
    const safeColor = ensureHexColor(color, '#000000');
    
    return (
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="w-6 h-6 rounded-full border border-white/10" 
          style={{ backgroundColor: safeColor }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-mono truncate">{name}</p>
        </div>
        <div className="text-xs font-mono opacity-70">{safeColor}</div>
      </div>
    );
  };
  
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
        
        <Tabs defaultValue="validation">
          <TabsList className="mb-4">
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="css-vars">CSS Variables</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="validation" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Theme Structure Validation</h3>
                <div className="p-4 bg-black/20 rounded-md space-y-2">
                  <div className="text-sm">
                    {validateCurrentTheme().map((issue, i) => (
                      <div 
                        key={i} 
                        className={`mb-1 ${issue.startsWith('✅') ? 'text-green-400' : 'text-amber-400'}`}
                      >
                        {issue}
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2 border-t border-white/10 mt-2">
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={refreshTheme}
                      className="mt-2"
                    >
                      Force Theme Refresh
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Current Theme Properties</h3>
                <div className="p-4 bg-black/20 rounded-md">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Theme ID:</div>
                    <div className="font-mono">{currentTheme?.id || 'N/A'}</div>
                    
                    <div className="font-medium">Theme Name:</div>
                    <div className="font-mono">{currentTheme?.name || 'N/A'}</div>
                    
                    <div className="font-medium">Status:</div>
                    <div className="font-mono">{currentTheme?.status || 'N/A'}</div>
                    
                    <div className="font-medium">Version:</div>
                    <div className="font-mono">{currentTheme?.version?.toString() || 'N/A'}</div>
                    
                    <div className="font-medium">Is Default:</div>
                    <div className="font-mono">{currentTheme?.is_default ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Primary Colors</h3>
                <div className="space-y-1 p-4 bg-black/20 rounded-md">
                  <ColorPreview 
                    color={getThemeProperty(currentTheme || impulseTheme, 'design_tokens.colors.primary', '#00F0FF')} 
                    name="primary" 
                  />
                  <ColorPreview 
                    color={getThemeProperty(currentTheme || impulseTheme, 'design_tokens.colors.secondary', '#FF2D6E')} 
                    name="secondary" 
                  />
                  <ColorPreview 
                    color={getThemeProperty(currentTheme || impulseTheme, 'design_tokens.colors.accent', '#8B5CF6')} 
                    name="accent" 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Background Colors</h3>
                <div className="space-y-1 p-4 bg-black/20 rounded-md">
                  <ColorPreview 
                    color={getThemeProperty(currentTheme || impulseTheme, 'design_tokens.colors.background.main', '#12121A')} 
                    name="background.main" 
                  />
                  <ColorPreview 
                    color={getThemeProperty(currentTheme || impulseTheme, 'design_tokens.colors.background.card', 'rgba(28, 32, 42, 0.7)')} 
                    name="background.card" 
                  />
                  <ColorPreview 
                    color={getThemeProperty(currentTheme || impulseTheme, 'design_tokens.colors.text.primary', '#F6F6F7')} 
                    name="text.primary" 
                  />
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
                  {Object.keys(componentStyles || {}).length > 0 ? 
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
                  {JSON.stringify(currentTheme?.design_tokens || impulseTheme, null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
