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
      console.log("Fetching user activity data...");
      
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
        .order("display_name")
        .returns<ProfileWithRoles[]>();

      if (error) {
        console.error("Error fetching user activity:", error);
        throw error;
      }

      // Transform the data to match our UserActivityProfile type
      const transformedProfiles: UserActivityProfile[] = profiles.map(profile => ({
        id: profile.id,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        is_active: profile.is_active || false,
        admin_override_active: profile.admin_override_active || false,
        profile_completed: profile.profile_completed || false,
        last_login: profile.last_login,
        last_forum_activity: profile.last_forum_activity,
        user_roles: profile.user_roles || []
      }));

      // Calculate stats
      const stats: UserActivityStats = {
        totalUsers: profiles.length,
        activeUsers: profiles.filter(p => p.is_active).length,
        completedProfiles: profiles.filter(p => p.profile_completed).length,
        adminOverrides: profiles.filter(p => p.admin_override_active).length
      };

      console.log("User activity data fetched:", {
        profilesCount: transformedProfiles.length,
        stats
      });

      return {
        profiles: transformedProfiles,
        stats
      };
    },
    enabled
  });
};