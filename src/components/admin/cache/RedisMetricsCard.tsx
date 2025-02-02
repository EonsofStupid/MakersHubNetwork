import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Database, Activity } from 'lucide-react';
import { RedisLogViewer, type LogEntry } from '@/components/admin/redis/RedisLogViewer';
import { toast } from 'sonner';

export const RedisMetricsCard = () => {
  const { data: logs, isLoading, error } = useQuery<LogEntry[]>({
    queryKey: ['redis-logs'],
    queryFn: async () => {
      // Simulated logs for now - replace with actual Redis logs fetch
      return [
        {
          level: 'info' as const,
          message: 'Redis connection established',
          timestamp: new Date().toISOString()
        },
        {
          level: 'warn' as const,
          message: 'High memory usage detected',
          timestamp: new Date().toISOString()
        }
      ];
    }
  });

  if (error) {
    toast.error('Failed to fetch Redis logs');
    return null;
  }

  return (
    <Card className="bg-black/20 backdrop-blur-lg border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-neon-cyan" />
          Redis Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Activity className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          logs && <RedisLogViewer logs={logs} />
        )}
      </CardContent>
    </Card>
  );
};