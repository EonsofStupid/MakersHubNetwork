import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/app/stores/theme/store';
import { UserPreferences } from '@/app/stores/theme/types';
import { Switch } from '@/site/components/ui/switch';
import { Label } from '@/site/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/site/components/ui/radio-group';
import { cn } from '@/app/utils/cn';

const colorOptions = [
  { label: 'Cyber Blue', value: '#00F0FF' },
  { label: 'Neon Pink', value: '#FF2D6E' },
  { label: 'Lime Green', value: '#39FF14' },
  { label: 'Electric Purple', value: '#9D00FF' },
  { label: 'Cyber Orange', value: '#FF9E00' },
];

export const ThemeCustomizer = () => {
  const { userPreferences, updateUserPreferences } = useThemeStore();
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(userPreferences);

  useEffect(() => {
    setLocalPreferences(userPreferences);
  }, [userPreferences]);

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const newPreferences = { ...localPreferences, [key]: value };
    setLocalPreferences(newPreferences);
    updateUserPreferences({ [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6 p-6 bg-background/80 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-primary">Theme Customization</h2>
        <p className="text-sm text-muted-foreground">
          Customize your theme preferences to enhance your experience.
        </p>
      </div>

      <div className="space-y-4">
        {/* Theme Mode */}
        <div className="space-y-2">
          <Label>Theme Mode</Label>
          <RadioGroup
            value={localPreferences.mode}
            onValueChange={(value) => handlePreferenceChange('mode', value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Accent Color */}
        <div className="space-y-2">
          <Label>Accent Color</Label>
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => handlePreferenceChange('accentColor', color.value)}
                className={cn(
                  'w-full aspect-square rounded-lg border-2 transition-all',
                  localPreferences.accentColor === color.value
                    ? 'border-primary scale-110'
                    : 'border-transparent hover:border-primary/50'
                )}
                style={{ backgroundColor: color.value }}
                title={color.label}
              />
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label>Font Size</Label>
          <RadioGroup
            value={localPreferences.fontSize}
            onValueChange={(value) => handlePreferenceChange('fontSize', value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large">Large</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Accessibility Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              checked={localPreferences.reducedMotion}
              onCheckedChange={(checked) =>
                handlePreferenceChange('reducedMotion', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>High Contrast</Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              checked={localPreferences.highContrast}
              onCheckedChange={(checked) =>
                handlePreferenceChange('highContrast', checked)
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 