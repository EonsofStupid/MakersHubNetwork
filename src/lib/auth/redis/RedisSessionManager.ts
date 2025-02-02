import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export class RedisSessionManager {
  private static instance: RedisSessionManager;
  private isRedisEnabled: boolean = false;

  private constructor() {
    this.initializeRedis();
  }

  public static getInstance(): RedisSessionManager {
    if (!RedisSessionManager.instance) {
      RedisSessionManager.instance = new RedisSessionManager();
    }
    return RedisSessionManager.instance;
  }

  private async initializeRedis() {
    try {
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'redis_config')
        .single();

      if (settings?.setting_value) {
        const config = JSON.parse(settings.setting_value);
        this.isRedisEnabled = config.enabled && config.features?.sessionManagement;
      }
    } catch (error) {
      console.error('Error initializing Redis:', error);
      this.isRedisEnabled = false;
    }
  }

  public async storeSession(session: Session): Promise<void> {
    if (!this.isRedisEnabled) return;

    try {
      await supabase.functions.invoke('store-session', {
        body: { session }
      });
    } catch (error) {
      console.error('Error storing session in Redis:', error);
    }
  }

  public async retrieveSession(sessionId: string): Promise<Session | null> {
    if (!this.isRedisEnabled) return null;

    try {
      const { data, error } = await supabase.functions.invoke('get-session', {
        body: { sessionId }
      });

      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Error retrieving session from Redis:', error);
      return null;
    }
  }

  public async removeSession(sessionId: string): Promise<void> {
    if (!this.isRedisEnabled) return;

    try {
      await supabase.functions.invoke('remove-session', {
        body: { sessionId }
      });
    } catch (error) {
      console.error('Error removing session from Redis:', error);
    }
  }
}