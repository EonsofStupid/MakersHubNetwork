
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { 
  UserActivityProfile, 
  UseUserActivityOptions, 
  UserActivityStats,
  ProfileWithRoles 
} from "@/types/user-activity";

export const useUserActivity = (options: UseUserActivityOptions = {}) => {
  const { enabled = true, includeInactive = false } = options;

  return useQuery({
    queryKey: ["userActivity", { includeInactive }],
    queryFn: async () => {
      console.log("useUserActivity - Starting data fetch...");
      
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          id,
          display_name,
          avatar_url,
          is_active,
          admin_override_active,
          profile_completed,
          last_login,
          last_forum_activity,
          user_roles (
            role
          )
        `)
        .order("display_name");

      if (error) {
        console.error("useUserActivity - Error fetching user activity:", error);
        throw error;
      }

      console.log("useUserActivity - Raw profiles data:", profiles);

      // Transform the data to match our UserActivityProfile type
      const transformedProfiles: UserActivityProfile[] = profiles.map(profile => {
        console.log("useUserActivity - Processing profile:", {
          id: profile.id,
          is_active: profile.is_active,
          admin_override: profile.admin_override_active
        });

        return {
          id: profile.id,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          is_active: profile.is_active || false,
          admin_override_active: profile.admin_override_active || false,
          profile_completed: profile.profile_completed || false,
          last_login: profile.last_login,
          last_forum_activity: profile.last_forum_activity,
          user_roles: profile.user_roles || []
        };
      });

      // Calculate stats
      const stats: UserActivityStats = {
        totalUsers: profiles.length,
        activeUsers: profiles.filter(p => p.is_active).length,
        completedProfiles: profiles.filter(p => p.profile_completed).length,
        adminOverrides: profiles.filter(p => p.admin_override_active).length
      };

      console.log("useUserActivity - Calculated stats:", {
        totalUsers: stats.totalUsers,
        activeUsers: stats.activeUsers,
        completedProfiles: stats.completedProfiles,
        adminOverrides: stats.adminOverrides,
        timestamp: new Date().toISOString()
      });

      return {
        profiles: transformedProfiles,
        stats
      };
    },
    enabled,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
