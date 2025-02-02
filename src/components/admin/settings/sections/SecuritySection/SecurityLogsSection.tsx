import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { SecurityLog } from '../../types/security';

export const SecurityLogsSection = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['security-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_logs')
        .select(`
          *,
          profiles (
            username,
            display_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as SecurityLog[];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6 bg-gray-800/50 border border-white/10">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Security Events</h3>
        <div className="space-y-2">
          {logs?.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-gray-700/50 rounded flex justify-between items-start"
            >
              <div>
                <p className="font-medium">{log.event_type}</p>
                <p className="text-sm text-gray-400">
                  User: {log.profiles?.display_name || 'System'}
                </p>
                <p className="text-sm text-gray-400">
                  IP: {log.ip_address || 'N/A'}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {format(new Date(log.created_at), 'PPpp')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};