import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from "@/components/ui/slider";
import { Settings, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const QuerySettingsTab = () => {
  const [settings, setSettings] = React.useState({
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    throwOnError: true,
  });

  const handleSave = async () => {
    try {
      // Save to Supabase implementation
      toast.success('Query settings saved successfully');
    } catch (error) {
      toast.error('Failed to save query settings');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800/50 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Query Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Retry Count</label>
              <Input
                type="number"
                value={settings.retry}
                onChange={(e) => setSettings(prev => ({ ...prev, retry: parseInt(e.target.value) }))}
                className="w-24 bg-gray-700/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Refetch on Window Focus</label>
              <Switch
                checked={settings.refetchOnWindowFocus}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, refetchOnWindowFocus: checked }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Stale Time (minutes)</label>
              <Slider
                value={[settings.staleTime / (60 * 1000)]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, staleTime: value[0] * 60 * 1000 }))}
                max={30}
                step={1}
              />
              <div className="text-xs text-gray-400 text-right">
                {settings.staleTime / (60 * 1000)} minutes
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Throw on Error</label>
              <Switch
                checked={settings.throwOnError}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, throwOnError: checked }))}
              />
            </div>
          </div>

          <Button 
            onClick={handleSave}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Save Query Settings
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};