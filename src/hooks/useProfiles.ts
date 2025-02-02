import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: 'subscriber' | 'maker' | 'admin' | 'super_admin' | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  last_seen: string | null;
  is_banned: boolean;
  ban_reason: string | null;
  banned_at: string | null;
  banned_by: string | null;
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async (): Promise<Profile[]> => {
      console.log('Fetching profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching profiles:', error);
        toast.error('Failed to load profiles');
        throw error;
      }

      console.log('Profiles fetched:', data);
      return data;
    },
  });
};