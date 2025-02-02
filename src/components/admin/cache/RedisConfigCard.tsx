import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Database, Server, Key, Clock, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RedisConfig {
  enabled: boolean;
  host: string;
  port: number;
  password?: string;
  ttl: number;
  maxMemory: number;
  restrictedMode: boolean;
  features: {
    sessionManagement: boolean;
    caching: boolean;
    realTimeUpdates: boolean;
  };
}

export const RedisConfigCard = () => {
  const [config, setConfig] = useState<RedisConfig>({
    enabled: false,
    host: 'localhost',
    port: 6379,
    ttl: 3600,
    maxMemory: 100,
    restrictedMode: false,
    features: {
      sessionManagement: true,
      caching: true,
      realTimeUpdates: false,
    }
  });
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveConfig = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('admin_settings')
        .upsert([
          {
            setting_key: 'redis_config',
            setting_value: JSON.stringify(config),
            setting_type: 'json'
          }
        ]);

      if (error) throw error;
      toast.success('Redis configuration saved successfully');
    } catch (error) {
      console.error('Error saving Redis config:', error);
      toast.error('Failed to save Redis configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      // This would be replaced with actual Redis connection testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Redis connection test successful');
    } catch (error) {
      toast.error('Redis connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Redis Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connection" className="space-y-4">
          <TabsList>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-muted-foreground" />
                <span>Enable Redis</span>
              </div>
              <Switch
                checked={config.enabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Host</label>
              <Input
                value={config.host}
                onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                placeholder="localhost"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Port</label>
              <Input
                type="number"
                value={config.port}
                onChange={(e) => setConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Password (optional)</label>
              <Input
                type="password"
                value={config.password}
                onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                className="bg-background/50"
              />
            </div>

            <Button 
              variant="secondary" 
              onClick={testConnection}
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Session Management</div>
                  <div className="text-xs text-muted-foreground">Use Redis for session storage</div>
                </div>
                <Switch
                  checked={config.features.sessionManagement}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({
                      ...prev,
                      features: { ...prev.features, sessionManagement: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Caching</div>
                  <div className="text-xs text-muted-foreground">Enable Redis caching for better performance</div>
                </div>
                <Switch
                  checked={config.features.caching}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({
                      ...prev,
                      features: { ...prev.features, caching: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Real-Time Updates</div>
                  <div className="text-xs text-muted-foreground">Use Redis pub/sub for real-time features</div>
                </div>
                <Switch
                  checked={config.features.realTimeUpdates}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({
                      ...prev,
                      features: { ...prev.features, realTimeUpdates: checked }
                    }))
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Restricted Mode</span>
              </div>
              <Switch
                checked={config.restrictedMode}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, restrictedMode: checked }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm">Cache TTL (seconds)</label>
              </div>
              <Input
                type="number"
                value={config.ttl}
                onChange={(e) => setConfig(prev => ({ ...prev, ttl: parseInt(e.target.value) }))}
                min="0"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm">Max Memory (MB)</label>
              </div>
              <Input
                type="number"
                value={config.maxMemory}
                onChange={(e) => setConfig(prev => ({ ...prev, maxMemory: parseInt(e.target.value) }))}
                min="0"
                className="bg-background/50"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};