import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  ip_address: string;
  created_at: string;
}

export const SecurityAuditLog = () => {
  const session = useSession();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    if (session?.user) {
      loadSecurityEvents();
    }
  }, [session]);

  const loadSecurityEvents = async () => {
    const { data: events } = await supabase
      .from('security_events')
      .select('*')
      .eq('user_id', session?.user?.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (events) setSecurityEvents(events);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Recent Security Events</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {securityEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.event_type}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-sm ${
                  event.severity === 'high' ? 'bg-red-100 text-red-800' :
                  event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {event.severity}
                </span>
              </TableCell>
              <TableCell>{event.ip_address}</TableCell>
              <TableCell>{new Date(event.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};