import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';

export const RedisFeatureToggles = () => {
  return (
    <Card className="bg-black/20 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="h-5 w-5 text-neon-cyan" />
          Feature Enablement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white/80">Session Management</label>
          <Switch className="data-[state=checked]:bg-neon-cyan" />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white/80">Caching</label>
          <Switch className="data-[state=checked]:bg-neon-cyan" />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white/80">Real-Time Updates</label>
          <Switch className="data-[state=checked]:bg-neon-cyan" />
        </div>
      </CardContent>
    </Card>
  );
};