import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  details: string;
  created_at: string;
  metadata: any;
}

export const ActivityLogTable = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["user-activities"],
    queryFn: async () => {
      console.log("Fetching user activities...");
      const { data, error } = await supabase
        .from("user_activity")
        .select(`
          *,
          profiles:profiles(username, display_name)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }
      
      console.log("Fetched activities:", data);
      return data as ActivityLog[];
    },
  });

  React.useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel('user_activity_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_activity'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gray-800/50 border border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-white">Activity Log</h2>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-8"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </motion.div>
            ) : activities?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 text-gray-400"
              >
                No activity recorded yet
              </motion.div>
            ) : (
              activities?.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-900/50 rounded-lg p-4 border border-white/5 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <User className="w-4 h-4 text-primary/60" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {activity.activity_type}
                        </p>
                        {activity.details && (
                          <p className="text-gray-400 text-sm mt-1">
                            {activity.details}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};