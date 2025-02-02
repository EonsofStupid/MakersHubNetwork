import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SecuritySettings } from '../../types/security';

export const RateLimitingSection = () => {
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
      toast.success('Rate limiting settings updated successfully');
    },
    onError: (error) => {
      console.error('Error updating rate limiting settings:', error);
      toast.error('Failed to update rate limiting settings');
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
          <Label htmlFor="max-requests">Maximum Requests</Label>
          <Input
            id="max-requests"
            type="number"
            value={settings?.rate_limit_requests || 100}
            onChange={(e) => handleUpdate('rate_limit_requests', parseInt(e.target.value))}
            className="mt-1"
          />
          <p className="text-sm text-gray-400 mt-1">
            Maximum number of requests allowed within the time window
          </p>
        </div>

        <div>
          <Label htmlFor="time-window">Time Window (minutes)</Label>
          <Input
            id="time-window"
            type="number"
            value={settings?.rate_limit_window_minutes || 5}
            onChange={(e) => handleUpdate('rate_limit_window_minutes', parseInt(e.target.value))}
            className="mt-1"
          />
          <p className="text-sm text-gray-400 mt-1">
            Time window in minutes for rate limiting
          </p>
        </div>
      </div>
    </Card>
  );
};