import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/stores/auth/store";
import { supabase } from "@/app/integrations/supabase/client";
import { UserActivityProfile, UserActivityStats } from "../types";

export const useUserActivity = () => {
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activityProfile, setActivityProfile] = useState<UserActivityProfile | null>(null);
  const [activityStats, setActivityStats] = useState<UserActivityStats | null>(null);

  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!user) {
        setActivityProfile(null);
        setActivityStats(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch user activity profile
        const { data: profileData, error: profileError } = await supabase
          .from("user_activity_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch user activity stats
        const { data: statsData, error: statsError } = await supabase
          .from("user_activity_stats")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (statsError) throw statsError;

        setActivityProfile(profileData);
        setActivityStats(statsData);
      } catch (err) {
        console.error("Error fetching user activity:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch user activity"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivity();
  }, [user]);

  const updateActivityProfile = async (updates: Partial<UserActivityProfile>) => {
    if (!user || !activityProfile) return;

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from("user_activity_profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      setActivityProfile({ ...activityProfile, ...updates });
    } catch (err) {
      console.error("Error updating activity profile:", err);
      setError(err instanceof Error ? err : new Error("Failed to update activity profile"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const incrementActivityStats = async (field: keyof UserActivityStats) => {
    if (!user || !activityStats) return;

    try {
      setIsLoading(true);
      setError(null);

      const updates = {
        [field]: activityStats[field] + 1,
        last_active: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("user_activity_stats")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      setActivityStats({ ...activityStats, ...updates });
    } catch (err) {
      console.error("Error incrementing activity stats:", err);
      setError(err instanceof Error ? err : new Error("Failed to increment activity stats"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activityProfile,
    activityStats,
    isLoading,
    error,
    updateActivityProfile,
    incrementActivityStats,
  };
}; 