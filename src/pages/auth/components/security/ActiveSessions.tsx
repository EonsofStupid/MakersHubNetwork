import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActiveSession {
  id: string;
  device_name: string;
  ip_address: string;
  user_agent: string;
  last_activity: string;
}

export const ActiveSessions = () => {
  const session = useSession();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  useEffect(() => {
    if (session?.user) {
      loadSessions();
    }
  }, [session]);

  const loadSessions = async () => {
    const { data, error } = await supabase
      .from('active_2fa_sessions')
      .select('*')
      .eq('user_id', session?.user?.id)
      .eq('is_active', true);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load active sessions",
      });
      return;
    }

    if (data) setSessions(data);
  };

  const terminateSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('active_2fa_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to terminate session",
      });
      return;
    }

    await loadSessions();
    toast({
      title: "Success",
      description: "Session terminated successfully",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Browser</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.device_name}</TableCell>
              <TableCell>{session.ip_address}</TableCell>
              <TableCell>{session.user_agent}</TableCell>
              <TableCell>{new Date(session.last_activity).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => terminateSession(session.id)}
                >
                  Terminate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};