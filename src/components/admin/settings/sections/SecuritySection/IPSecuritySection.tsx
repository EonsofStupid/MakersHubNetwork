import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { SecuritySettings } from '../../types/security';

export const IPSecuritySection = () => {
  const [newIP, setNewIP] = React.useState('');
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
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('id')
        .single();

      if (!settingsData?.id) throw new Error('Settings not found');

      const { data, error } = await supabase
        .from('site_settings')
        .update({ security_settings: newSettings })
        .eq('id', settingsData.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Security settings updated successfully');
    },
    onError: (error) => {
      console.error('Error updating security settings:', error);
      toast.error('Failed to update security settings');
    }
  });

  const addToList = (list: 'ip_whitelist' | 'ip_blacklist') => {
    if (!newIP || !settings) return;
    
    const updatedSettings = {
      ...settings,
      [list]: [...(settings[list] || []), newIP]
    };
    
    updateSettings.mutate(updatedSettings);
    setNewIP('');
  };

  const removeFromList = (list: 'ip_whitelist' | 'ip_blacklist', ip: string) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      [list]: settings[list].filter((item: string) => item !== ip)
    };
    
    updateSettings.mutate(updatedSettings);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gray-800/50 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">IP Whitelist</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter IP address"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
            />
            <Button onClick={() => addToList('ip_whitelist')}>
              <Plus className="w-4 h-4 mr-2" />
              Add IP
            </Button>
          </div>
          <div className="grid gap-2">
            {settings?.ip_whitelist?.map((ip: string) => (
              <div key={ip} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                <span>{ip}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromList('ip_whitelist', ip)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gray-800/50 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">IP Blacklist</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter IP address"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
            />
            <Button onClick={() => addToList('ip_blacklist')}>
              <Plus className="w-4 h-4 mr-2" />
              Add IP
            </Button>
          </div>
          <div className="grid gap-2">
            {settings?.ip_blacklist?.map((ip: string) => (
              <div key={ip} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                <span>{ip}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromList('ip_blacklist', ip)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};