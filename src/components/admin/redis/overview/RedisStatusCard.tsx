import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Server, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const RedisStatusCard = () => {
  const navigate = useNavigate();
  
  const { data: status } = useQuery({
    queryKey: ['redis-status'],
    queryFn: async () => {
      return {
        enabled: true,
        mode: 'full',
        memoryUsage: 42,
        memoryLimit: 128,
        keys: 5232,
        uptime: '3 days, 12 hours'
      };
    },
    refetchInterval: 5000
  });

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-neon-cyan/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
          <Database className="h-5 w-5 text-neon-cyan" />
          Services Overview
        </CardTitle>
        <Badge variant="default" className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
          {status?.enabled ? "Enabled" : "Disabled"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-white/60 flex items-center gap-2">
              <Server className="h-4 w-4" />
              Mode
            </div>
            <p className="text-lg font-semibold text-white">{status?.mode === 'full' ? 'Full' : 'Restricted'}</p>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-white/60 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Uptime
            </div>
            <p className="text-lg font-semibold text-white">{status?.uptime}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>Memory Usage</span>
            <span>{status?.memoryUsage} MB / {status?.memoryLimit} MB</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neon-cyan transition-all duration-500"
              style={{ width: `${(status?.memoryUsage / status?.memoryLimit) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/redis/configure')}
            className="hover:bg-white/5 text-white/80 hover:text-neon-cyan"
          >
            Configure Redis
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/admin/redis/metrics')}
            className="hover:bg-white/5 text-white/80 hover:text-neon-cyan"
          >
            View Metrics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};