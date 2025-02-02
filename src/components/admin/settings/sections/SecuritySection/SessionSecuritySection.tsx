import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SecuritySettings } from '../../types/security';

export const SessionSecuritySection = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('security_settings')
        .single();

      if (error) throw error;
      return data.security_settings as SecuritySettings;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: SecuritySettings) => {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ security_settings: newSettings })
        .eq('id', (await supabase.from('site_settings').select('id').single()).data.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Session security settings updated successfully');
    },
    onError: (error) => {
      console.error('Error updating session security settings:', error);
      toast.error('Failed to update session security settings');
    }
  });

  const handleUpdate = (key: keyof SecuritySettings, value: number) => {
    if (!settings) return;
    
    const updatedSettings = {
      ...settings,
      [key]: value
    };
    updateSettings.mutate(updatedSettings);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6 bg-gray-800/50 border border-white/10">
      <div className="space-y-6">
        <div>
          <Label htmlFor="max-attempts">Maximum Login Attempts</Label>
          <Input
            id="max-attempts"
            type="number"
            value={settings?.max_login_attempts || 5}
            onChange={(e) => handleUpdate('max_login_attempts', parseInt(e.target.value))}
            className="mt-1"
          />
          <p className="text-sm text-gray-400 mt-1">
            Number of failed login attempts before account lockout
          </p>
        </div>

        <div>
          <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
          <Input
            id="lockout-duration"
            type="number"
            value={settings?.lockout_duration_minutes || 30}
            onChange={(e) => handleUpdate('lockout_duration_minutes', parseInt(e.target.value))}
            className="mt-1"
          />
          <p className="text-sm text-gray-400 mt-1">
            Duration of account lockout after maximum failed attempts
          </p>
        </div>

        <div>
          <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
          <Input
            id="session-timeout"
            type="number"
            value={settings?.session_timeout_minutes || 60}
            onChange={(e) => handleUpdate('session_timeout_minutes', parseInt(e.target.value))}
            className="mt-1"
          />
          <p className="text-sm text-gray-400 mt-1">
            Duration before an inactive session expires
          </p>
        </div>
      </div>
    </Card>
  );
};