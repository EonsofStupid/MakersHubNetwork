
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useActiveUsersCount = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupPresence = async () => {
      try {
        setIsLoading(true);
        
        channel = supabase.channel('online-users', {
          config: {
            presence: {
              key: 'online-users',
            },
          },
        });

        // Handle presence state changes
        channel
          .on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            const uniqueUsers = new Set(
              Object.values(state)
                .flat()
                .map((presence: any) => presence.user_id)
            );
            setCount(uniqueUsers.size);
            setIsLoading(false);
          })
          .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            console.log('User joined:', key, newPresences);
          })
          .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            console.log('User left:', key, leftPresences);
          });

        // Subscribe to the channel
        await channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              online_at: new Date().toISOString(),
              user_id: 'admin-dashboard', // Special identifier for admin dashboard
            });
          }
        });

      } catch (err) {
        console.error('Error setting up presence:', err);
        setError(err instanceof Error ? err : new Error('Failed to setup presence'));
        setIsLoading(false);
      }
    };

    setupPresence();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const refresh = async () => {
    try {
      setIsLoading(true);
      // Re-subscribe to the channel
      await supabase.removeChannel('online-users');
      const newChannel = supabase.channel('online-users');
      await newChannel.subscribe();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setIsLoading(false);
    }
  };

  return { count, isLoading, error, refresh };
};
