import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Server } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const RedisConnectionForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    host: '',
    port: '6379',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-redis-connection', {
        body: JSON.stringify(formData)
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Redis connection successful');
      } else {
        toast.error('Failed to connect to Redis');
      }
    } catch (error) {
      console.error('Redis connection error:', error);
      toast.error('Failed to connect to Redis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Server className="h-5 w-5 text-neon-cyan" />
          Redis Connection Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Redis Host</label>
          <Input 
            name="host"
            value={formData.host}
            onChange={handleInputChange}
            placeholder="your-redis-host.com" 
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Port</label>
          <Input 
            name="port"
            value={formData.port}
            onChange={handleInputChange}
            type="number" 
            placeholder="6379" 
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Password (optional)</label>
          <Input 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password" 
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>

        <Button 
          className="w-full bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition-colors" 
          onClick={handleTestConnection}
          disabled={isLoading}
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Button>
      </CardContent>
    </Card>
  );
};