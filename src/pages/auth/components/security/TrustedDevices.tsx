import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Smartphone } from "lucide-react";

interface TrustedDevice {
  id: string;
  device_name: string;
  last_used: string;
  expires_at: string;
}

export const TrustedDevices = () => {
  const session = useSession();
  const { toast } = useToast();
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([]);

  useEffect(() => {
    if (session?.user) {
      loadTrustedDevices();
    }
  }, [session]);

  const loadTrustedDevices = async () => {
    try {
      const { data: devices, error } = await supabase
        .from('trusted_devices')
        .select('*')
        .eq('user_id', session?.user?.id)
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;
      if (devices) setTrustedDevices(devices);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load trusted devices",
      });
    }
  };

  const removeTrustedDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('trusted_devices')
        .delete()
        .eq('id', deviceId);

      if (error) throw error;

      setTrustedDevices(trustedDevices.filter(d => d.id !== deviceId));
      toast({
        title: "Success",
        description: "Device removed from trusted devices",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove trusted device",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Trusted Devices</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trustedDevices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.device_name}</TableCell>
              <TableCell>{new Date(device.last_used).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(device.expires_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeTrustedDevice(device.id)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};