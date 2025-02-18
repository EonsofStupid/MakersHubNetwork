
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useActiveUsersCount = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const setupPresence = async () => {
      try {
        setIsLoading(true);
        
        const newChannel = supabase.channel('online-users', {
          config: {
            presence: {
              key: 'online-users',
            },
          },
        });

        // Handle presence state changes
        newChannel
          .on('presence', { event: 'sync' }, () => {
            const state = newChannel.presenceState();
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
        await newChannel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await newChannel.track({
              online_at: new Date().toISOString(),
              user_id: 'admin-dashboard', // Special identifier for admin dashboard
            });
          }
        });

        setChannel(newChannel);

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
      if (channel) {
        await supabase.removeChannel(channel);
      }
      const newChannel = supabase.channel('online-users', {
        config: {
          presence: {
            key: 'online-users',
          },
        },
      });
      await newChannel.subscribe();
      setChannel(newChannel);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setIsLoading(false);
    }
  };

  return { count, isLoading, error, refresh };
};
