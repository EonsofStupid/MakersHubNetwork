import { SessionManager } from './SessionManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityConfig {
  maxConcurrentSessions?: number;
  maxLoginAttempts?: number;
  lockoutDuration?: number; // in minutes
}

class SecurityManager {
  private sessionManager: SessionManager;
  private config: SecurityConfig;
  private initialized: boolean = false;

  constructor(config: SecurityConfig = {}) {
    this.sessionManager = SessionManager.getInstance();
    this.config = {
      maxConcurrentSessions: 3,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      ...config
    };
  }

  private async handleSecurityEvent(
    userId: string,
    eventType: string,
    severity: 'low' | 'medium' | 'high',
    details: Record<string, any> = {}
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('security_events')
        .insert({
          user_id: userId,
          event_type: eventType,
          severity,
          details,
          ip_address: null // In a real app, you'd get this from the request
        });

      if (error) throw error;
      
      console.log('Security event logged:', { eventType, severity, details });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private async checkConcurrentSessions(userId: string): Promise<boolean> {
    try {
      const { data: sessions, error } = await supabase
        .from('active_2fa_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      return (sessions?.length || 0) < this.config.maxConcurrentSessions!;
    } catch (error) {
      console.error('Error checking concurrent sessions:', error);
      return true; // Fail open to prevent lockouts
    }
  }

  public async validateSession(session: any): Promise<boolean> {
    if (!session?.user?.id) {
      throw new Error('Invalid session');
    }

    try {
      // Check if user is banned
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_banned')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      if (profile?.is_banned) {
        await this.handleSecurityEvent(
          session.user.id,
          'banned_user_access_attempt',
          'high'
        );
        throw new Error('Account is banned');
      }

      // Check concurrent sessions
      const canCreateSession = await this.checkConcurrentSessions(session.user.id);
      if (!canCreateSession) {
        await this.handleSecurityEvent(
          session.user.id,
          'max_concurrent_sessions_exceeded',
          'medium'
        );
        throw new Error('Maximum number of concurrent sessions reached');
      }

      await this.handleSecurityEvent(
        session.user.id,
        'successful_session_validation',
        'low'
      );

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      throw error;
    }
  }

  public async handleFailedLogin(userId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('failed_login_attempts, lockout_until')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const attempts = (data?.failed_login_attempts || 0) + 1;
      const updates: any = { failed_login_attempts: attempts };

      if (attempts >= this.config.maxLoginAttempts!) {
        updates.lockout_until = new Date(
          Date.now() + this.config.lockoutDuration! * 60000
        ).toISOString();
        
        await this.handleSecurityEvent(
          userId,
          'account_locked',
          'high',
          { attempts, lockout_duration: this.config.lockoutDuration }
        );

        toast.error('Account locked', {
          description: `Too many failed attempts. Please try again in ${this.config.lockoutDuration} minutes.`
        });
      }

      await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

    } catch (error) {
      console.error('Error handling failed login:', error);
    }
  }

  public async resetLoginAttempts(userId: string): Promise<void> {
    try {
      await supabase
        .from('profiles')
        .update({
          failed_login_attempts: 0,
          lockout_until: null
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Error resetting login attempts:', error);
    }
  }

  public initialize(): void {
    if (this.initialized) {
      console.log('Security manager already initialized');
      return;
    }

    try {
      console.log('Initializing security manager');
      this.sessionManager.startSession();
      this.initialized = true;
      console.log('Security manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize security manager:', error);
      throw error;
    }
  }

  public clearSecurityData(): void {
    console.log('Clearing security data');
    this.initialized = false;
  }

  public cleanup(): void {
    console.log('Cleaning up security manager');
    this.sessionManager.destroy();
    this.initialized = false;
  }
}

// Create and export a singleton instance
export const securityManager = new SecurityManager();