
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaintBrush, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

// Theme options available to users
const themeOptions = [
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon lights and digital-age aesthetic', colors: ['#00F0FF', '#FF2D6E', '#8B5CF6'] },
  { id: 'minimal', name: 'Minimal', description: 'Clean, simple, and focused design', colors: ['#6366F1', '#EC4899', '#8B5CF6'] },
  { id: 'dark', name: 'Dark Matter', description: 'Deep space inspired dark theme', colors: ['#10B981', '#3B82F6', '#8B5CF6'] },
  { id: 'light', name: 'Light Mode', description: 'Bright and accessible interface', colors: ['#3B82F6', '#EC4899', '#10B981'] },
];

export default function ThemeSettings() {
  const [selectedTheme, setSelectedTheme] = useState('cyberpunk');
  const [isLoading, setIsLoading] = useState(false);
  const [userPreference, setUserPreference] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const logger = useLogger('ThemeSettings', LogCategory.THEME);

  // Load user's theme preference
  useEffect(() => {
    const loadUserPreference = async () => {
      if (!user?.id) return;
      
      try {
        logger.info('Loading user theme preference');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('theme_preference')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data?.theme_preference) {
          setSelectedTheme(data.theme_preference);
          setUserPreference(data.theme_preference);
          logger.debug('User theme preference loaded', { 
            details: { preference: data.theme_preference } 
          });
        }
      } catch (err) {
        logger.error('Error loading user theme preference', { 
          details: safeDetails(err) 
        });
      }
    };
    
    loadUserPreference();
  }, [user?.id, logger]);

  // Save user's theme preference
  const saveThemePreference = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your theme preferences",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      logger.info('Saving user theme preference', { 
        details: { theme: selectedTheme } 
      });
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          theme_preference: selectedTheme,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUserPreference(selectedTheme);
      
      toast({
        title: "Theme updated",
        description: "Your theme preference has been saved",
      });
      
      logger.info('Theme preference saved successfully');
      
      // Reload the page to apply the new theme
      // In a more sophisticated implementation, we would use a theme context
      // to apply the theme without a page reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      logger.error('Error saving theme preference', { 
        details: safeDetails(err) 
      });
      
      toast({
        title: "Update failed",
        description: "Failed to save your theme preference",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/profile" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={saveThemePreference}
            disabled={isLoading || selectedTheme === userPreference}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        <PaintBrush className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold">Theme Settings</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Choose a Theme</CardTitle>
          <CardDescription>
            Select a visual theme for your MakersImpulse experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedTheme} 
            onValueChange={setSelectedTheme}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {themeOptions.map((theme) => (
              <div 
                key={theme.id}
                className={`
                  relative rounded-lg border p-4 cursor-pointer transition-all duration-200 
                  ${selectedTheme === theme.id 
                    ? 'border-primary bg-primary/5 shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <RadioGroupItem 
                  value={theme.id} 
                  id={theme.id} 
                  className="absolute right-4 top-4 opacity-0"
                />
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-foreground">{theme.name}</h3>
                    {selectedTheme === theme.id && (
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {theme.description}
                  </p>
                  
                  <div className="flex gap-2 mt-1">
                    {theme.colors.map((color, i) => (
                      <div 
                        key={`${theme.id}-color-${i}`}
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Animation Settings</CardTitle>
          <CardDescription>
            Configure motion and animation preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reduce-motion"
                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              />
              <Label htmlFor="reduce-motion">
                Reduce motion (reduces animations throughout the interface)
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="disable-effects"
                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              />
              <Label htmlFor="disable-effects">
                Disable glow effects
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
