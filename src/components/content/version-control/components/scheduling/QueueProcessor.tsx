import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QueueItem {
  id: string;
  content_id: string;
  scheduled_for: string;
  status: string;
  created_at: string;
  error_message?: string;
  processed_at?: string;
}

export const QueueProcessor: React.FC = () => {
  const { data: queueItems, isLoading } = useQuery({
    queryKey: ['publishing-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('publishing_queue')
        .select('*')
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      return data as QueueItem[];
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  useEffect(() => {
    const processQueue = async () => {
      const now = new Date();
      const itemsToProcess = queueItems?.filter(
        item => new Date(item.scheduled_for) <= now && item.status === 'pending'
      );

      if (itemsToProcess?.length) {
        for (const item of itemsToProcess) {
          try {
            // Update content status to published
            await supabase
              .from('cms_content')
              .update({ status: 'published' })
              .eq('id', item.content_id);

            // Update queue item status
            await supabase
              .from('publishing_queue')
              .update({ 
                status: 'completed',
                processed_at: new Date().toISOString()
              })
              .eq('id', item.id);

            toast.success(`Content ${item.content_id} published successfully`);
          } catch (error) {
            console.error('Error processing queue item:', error);
            await supabase
              .from('publishing_queue')
              .update({ 
                status: 'failed',
                error_message: (error as Error).message
              })
              .eq('id', item.id);

            toast.error(`Failed to publish content ${item.content_id}`);
          }
        }
      }
    };

    const interval = setInterval(processQueue, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [queueItems]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4 bg-black/40 backdrop-blur-xl border-white/10">
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-white/60" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-black/40 backdrop-blur-xl border-white/10">
      <h3 className="text-lg font-semibold mb-4 text-white">Publishing Queue</h3>
      <div className="space-y-3">
        {queueItems?.map((item) => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={cn("flex items-center gap-1", getStatusColor(item.status))}>
                  {getStatusIcon(item.status)}
                  <span className="text-sm capitalize">{item.status}</span>
                </span>
                <span className="text-sm text-white/60">•</span>
                <span className="text-sm text-white/60">
                  {format(new Date(item.scheduled_for), 'PPp')}
                </span>
              </div>
              
              {item.processed_at && (
                <p className="text-xs text-white/40">
                  Processed: {format(new Date(item.processed_at), 'PPp')}
                </p>
              )}
              
              {item.error_message && (
                <p className="text-sm text-red-400 mt-1 bg-red-500/10 p-2 rounded border border-red-500/20">
                  {item.error_message}
                </p>
              )}
            </div>
            
            <Badge
              variant={
                item.status === 'completed' ? 'secondary' :
                item.status === 'failed' ? 'destructive' :
                'default'
              }
              className="capitalize"
            >
              {item.status}
            </Badge>
          </div>
        ))}
        
        {(!queueItems || queueItems.length === 0) && (
          <div className="text-center p-4 text-white/60">
            No scheduled publications in queue
          </div>
        )}
      </div>
    </Card>
  );
};