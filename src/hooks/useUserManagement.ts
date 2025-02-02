import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { UserRole } from '@/components/auth/types';

export const useUserManagement = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users with profiles and CMS data...');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          banned_by(username),
          cms_content!cms_content_created_by_fkey(count),
          user_activity(count),
          user_activity_cms(count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data;
    },
  });

  const getUserActivity = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  const getUserCMSActivity = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_activity_cms')
      .select('*, cms_content(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  const updateRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      console.log('Updating user role:', { userId, newRole });
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (updateError) throw updateError;

      const { error: activityError } = await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          activity_type: 'role_update',
          details: `Role updated to ${newRole}`,
          metadata: { previous_role: users?.find(u => u.id === userId)?.role }
        });

      if (activityError) throw activityError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  });

  const banUser = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { error } = await supabase.rpc('ban_user', {
        user_id: userId,
        reason: reason,
        admin_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User banned successfully');
    },
    onError: (error) => {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  });

  const unbanUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_banned: false,
          ban_reason: null,
          banned_at: null,
          banned_by: null
        })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User unbanned successfully');
    },
    onError: (error) => {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    updateRole,
    banUser,
    unbanUser,
    getUserActivity,
    getUserCMSActivity
  };
};