import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ImportSession } from './types';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export const ImportManager = () => {
  const [sessions, setSessions] = useState<ImportSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('import_sessions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Add default values for type and metadata to match ImportSession interface
        const processedData = (data || []).map(session => ({
          ...session,
          type: session.type || 'unknown',
          metadata: session.metadata || {}
        })) as ImportSession[];

        setSessions(processedData);
      } catch (error) {
        console.error('Error fetching import sessions:', error);
        toast.error('Failed to load import sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <div>Loading import sessions...</div>;
  }

  return (
    <Card className="p-6 space-y-4 bg-black/40 border-white/10">
      <h2 className="text-xl font-semibold">Import History</h2>
      <div className="space-y-2">
        {sessions.map((session) => (
          <div 
            key={session.id}
            className="p-4 rounded-lg bg-black/20 border border-white/10"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{session.file_name}</p>
                <p className="text-sm text-gray-400">
                  Status: {session.status} | Type: {session.type}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(session.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};